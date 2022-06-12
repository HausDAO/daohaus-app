import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { RiAddFill } from 'react-icons/ri';
import { Flex, Stack, Button, Link, Spinner, VStack } from '@chakra-ui/react';
import LitJsSdk from 'lit-js-sdk';
import { useOverlay } from '../contexts/OverlayContext';
import BoostNotActive from '../components/boostNotActive';
import MainViewLayout from '../components/mainViewLayout';
import SnapshotCard from '../components/snapshotCard';
import TextBox from '../components/TextBox';
import {
  checkIfUserExists,
  handleLoadCurrentUser,
  getSharedGoogleDocs,
  getSharedDaoGoogleDocs,
  STANDARD_CONTRACT_TYPE,
  loadStoredAuthSig,
  signOutUser,
  handleLitServerError,
  redirectToLitOauthUI,
  deleteStoredAuthSigs,
  storeAuthSig,
  LIT_API_HOST,
  deleteShare,
} from '../utils/litProtocol';
import GoogleLitCard from '../components/GoogleLitCard';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const LitProtocolGoogle = ({ isMember, daoMetaData, refetchMetaData }) => {
  const { daoid, daochain } = useParams();
  const { address } = useInjectedProvider();
  const [loading, setLoading] = useState(true);
  const [googleDocs, setgoogleDocs] = useState([]);
  const [showSignatureButton, setShowSignatureButton] = useState(true);
  const [authSig, setAuthSig] = useState(null);
  const [profile, setProfile] = useState(null);
  const { errorToast, successToast } = useOverlay();

  useEffect(() => {
    const checkAndSetProfile = async () => {
      const localAuthSig = loadStoredAuthSig(address);

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
  }, [address]);

  const getAllGoogleDocs = async () => {
    try {
      setgoogleDocs(await getSharedGoogleDocs(authSig, profile?.idOnService));
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
      storeAuthSig(currentAuthSig, address);
      setAuthSig(currentAuthSig);

      userExists = await checkIfUserExists(currentAuthSig);
      if (userExists) {
        await callback(currentAuthSig);
        return;
      } else {
        // TODO handle this case - create frontend user on Lit side..
        // https://github.com/LIT-Protocol/lit-oauth/blob/51b6efc4c45ee6b0bf0ebfed4f8713c6c045b954/server/oauth/google.js#L104
        // warningToast({title: 'Redirecting you to lit oauth connect UI'});
        // await redirectToLitOauthUI();
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
      deleteStoredAuthSigs(address);
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

  console.log(googleDocs);

  const LitAuthSigButton = () =>
    isMember && (
      <Flex>
        <Button onClick={handleSignAuthMessage}>
          Authenticate Lit Protocol
        </Button>
      </Flex>
    );

  const addNewGoogleDoc = isMember && (
    <Flex>
      <Button
        as={Link}
        href={`${LIT_API_HOST}/google?source=daohaus&dao_address=${daoMetaData?.address}&dao_name=${daoMetaData?.name}&contract_type=${STANDARD_CONTRACT_TYPE}`}
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
                    daoMetaData={daoMetaData}
                  />
                ))
            ) : (
              <Flex as={VStack} mt='100px' w='100%' justify='center'>
                {showSignatureButton && <LitAuthSigButton />}
                <TextBox variant='value' size='lg'>
                  No Google Docs found.
                </TextBox>
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
