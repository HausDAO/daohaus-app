import { Button, Flex, Link, Spinner, Stack, VStack } from '@chakra-ui/react';
import LitJsSdk from 'lit-js-sdk';
import React, { useEffect, useState } from 'react';

import BoostNotActive from '../components/boostNotActive';
import GoogleLitCard from '../components/GoogleLitCard';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import {
  checkIfUserExists,
  deleteShare,
  deleteStoredAuthSigs,
  getSharedDaoGoogleDocs,
  handleLitServerError,
  handleLoadCurrentUser,
  LIT_API_HOST,
  loadStoredAuthSig,
  redirectToLitOauthUI,
  signOutUser,
  STANDARD_CONTRACT_TYPE,
  storeAuthSig,
} from '../utils/litProtocol';

import { capitalize } from '../utils/general';
import { Bold } from '../components/typography';

const LitProtocolGoogle = ({ isMember, daoMetaData }) => {
  const { address } = useInjectedProvider();
  const [loading, setLoading] = useState(true);
  const [googleDocs, setgoogleDocs] = useState([]);
  const [showSignatureButton, setShowSignatureButton] = useState(true);
  const [authSig, setAuthSig] = useState(null);
  const [profile, setProfile] = useState(null);
  const { errorToast, warningToast, successToast } = useOverlay();

  useEffect(() => {
    const checkAndSetProfile = async () => {
      const localAuthSig = loadStoredAuthSig(
        address,
        daoMetaData?.contractAddress,
      );

      if (localAuthSig) {
        setAuthSig(localAuthSig);
        if (await checkIfUserExists(localAuthSig)) {
          setProfile(await handleLoadCurrentUser(localAuthSig));
          setShowSignatureButton(false);
        }
      } else {
        setAuthSig(null);
        setProfile(null);
        setShowSignatureButton(true);
      }
    };

    checkAndSetProfile();
  }, [address, daoMetaData?.contractAddress]);

  const getAllGoogleDocs = async () => {
    try {
      setgoogleDocs(
        await getSharedDaoGoogleDocs(
          authSig,
          profile?.idOnService,
          daoMetaData?.contractAddress,
        ),
      );
      setShowSignatureButton(false);
    } catch (err) {
      console.log(err);
      errorToast({
        title: 'Fetching google docs failed',
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!profile || !daoMetaData?.boosts) {
      setLoading(false);
      return;
    }

    if (daoMetaData && daoMetaData?.boosts?.GOOGLE_LIT.active && profile) {
      getAllGoogleDocs();
    }
  }, [daoMetaData?.boosts, authSig, profile]);

  const performWithAuthSig = async (
    callback,
    { chain } = { chain: 'ethereum' },
  ) => {
    let currentAuthSig = authSig;
    try {
      let userExists;
      currentAuthSig = await await LitJsSdk.checkAndSignAuthMessage({
        chain,
      });
      storeAuthSig(currentAuthSig, address, daoMetaData?.contractAddress);
      setAuthSig(currentAuthSig);

      userExists = await checkIfUserExists(currentAuthSig);
      if (userExists) {
        await callback(currentAuthSig);
        return;
      } else {
        // https://github.com/LIT-Protocol/lit-oauth/blob/51b6efc4c45ee6b0bf0ebfed4f8713c6c045b954/server/oauth/google.js#L104
        warningToast({ title: 'Redirecting you to lit oauth connect UI' });
        await redirectToLitOauthUI();
      }

      await callback(currentAuthSig);
    } catch (e) {
      return handleLitServerError(e);
    }
  };

  const handleSignAuthMessage = async () => {
    setLoading(true);
    try {
      await performWithAuthSig(
        async authSig => {
          setProfile(await handleLoadCurrentUser(authSig));
          setLoading(false);
        },
        {
          chain: daoMetaData?.network,
        },
      );
    } catch (e) {
      errorToast(e);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      deleteStoredAuthSigs(address, daoMetaData?.contractAddress);
      setProfile(null);
      setAuthSig(null);
      setgoogleDocs([]);
      setShowSignatureButton(true);
      await LitJsSdk.disconnectWeb3();
      await signOutUser(authSig);
    } catch (e) {
      console.log(e);
    }
  };

  const LitAuthSigButton = () =>
    isMember && (
      <Flex as={Stack}>
        <Flex as={VStack} spacing={4} alignItems='center'>
          <TextBox>
            <Bold>1)</Bold> This link will redirect you to the{' '}
            <Bold>Lit App Portal where</Bold> you will have to connect to google
            via <Bold>mainnet</Bold>
          </TextBox>
          <Button
            as={Link}
            href='https://oauth-app.litgateway.com/google'
            isExternal
            mr={10}
          >
            Connect to Lit App Portal
          </Button>
        </Flex>
        <Flex as={VStack} spacing={4} alignItems='center'>
          <TextBox>
            <Bold>2)</Bold> Reconnect to{' '}
            <Bold>{capitalize(daoMetaData?.network)} </Bold>
            after step 1 and generate an authentication token.
          </TextBox>
          <Button onClick={handleSignAuthMessage}>
            Authneticate Lit Protocol on {capitalize(daoMetaData?.network)}
          </Button>
        </Flex>
      </Flex>
    );

  const addNewGoogleDoc = isMember && (
    <Flex>
      <Button
        as={Link}
        href={`${LIT_API_HOST}/google?source=daohaus&dao_address=${daoMetaData?.contractAddress}&dao_name=${daoMetaData?.name}&contract_type=${STANDARD_CONTRACT_TYPE}`}
        isExternal
        mr={10}
      >
        Share Google Drive Item
      </Button>

      <Button onClick={handleSignOut} mr={10}>
        Sign Out
      </Button>
    </Flex>
  );

  const handleDeleteShare = async shareInfo => {
    try {
      await deleteShare(shareInfo.id);
      await getAllGoogleDocs();
      successToast({ title: `${shareInfo.name} has been unshared.` });
    } catch (err) {
      console.log(`'Error deleting share', ${err}`);
      errorToast({ title: 'Error deleting share', description: err });
    }
  };

  const getLinkFromShare = async () => {
    successToast({ title: 'Link has been copied to clipboard.' });
  };

  return (
    <MainViewLayout
      header='Lit Protocol - Google Docs'
      headerEl={authSig && addNewGoogleDoc}
      isDao
    >
      <Flex as={Stack} direction='column' spacing={4} w='100%'>
        {!loading ? (
          daoMetaData?.boosts?.GOOGLE_LIT?.active ? (
            Object.keys(googleDocs).length > 0 ? (
              Object.values(googleDocs)
                .slice(0, 10)
                .map(googleDoc => (
                  <GoogleLitCard
                    key={googleDoc?.id}
                    googleDoc={googleDoc}
                    getLinkFromShare={getLinkFromShare}
                    handleDeleteShare={handleDeleteShare}
                  />
                ))
            ) : (
              <Flex as={VStack} mt='100px' w='100%' justify='center'>
                {showSignatureButton ? (
                  <LitAuthSigButton />
                ) : (
                  <TextBox variant='value' size='lg'>
                    No Google Docs found.
                  </TextBox>
                )}
              </Flex>
            )
          ) : (
            <BoostNotActive />
          )
        ) : (
          <Flex mt='100px' w='100%' justify='center'>
            <Spinner size='xl' />
          </Flex>
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default LitProtocolGoogle;
