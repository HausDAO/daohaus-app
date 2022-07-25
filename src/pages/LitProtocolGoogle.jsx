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
  buildLitUrl,
  checkIfUserExists,
  deleteShare,
  deleteStoredAuthSigs,
  getSharedDaoGoogleDocs,
  handleLitServerError,
  handleLoadCurrentUser,
  loadStoredAuthSig,
  redirectToLitOauthUI,
  signOutUser,
  storeAuthSig,
} from '../utils/litProtocol';

import { debounce } from '../utils/debounce';

const LitProtocolGoogle = ({ isMember, daoMetaData }) => {
  const { address } = useInjectedProvider();
  const [loading, setLoading] = useState(true);
  const [googleDocs, setgoogleDocs] = useState([]);
  const [showSignatureButton, setShowSignatureButton] = useState(true);
  const [authSig, setAuthSig] = useState(null);
  const [profile, setProfile] = useState(null);
  const { errorToast, warningToast, successToast } = useOverlay();

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

  const performWithAuthSig = async callback => {
    let currentAuthSig = authSig;
    console.log(daoMetaData);
    try {
      let userExists;
      currentAuthSig = await LitJsSdk.checkAndSignAuthMessage({
        // agnostic signature; Lit only needs the wallet address
        switchChain: false,
        chain: daoMetaData?.network,
      });
      storeAuthSig(currentAuthSig, address, daoMetaData?.contractAddress);
      setAuthSig(currentAuthSig);

      userExists = await checkIfUserExists(currentAuthSig);
      if (userExists) {
        await callback(currentAuthSig);
        return;
      } else {
        // https://github.com/LIT-Protocol/lit-oauth/blob/51b6efc4c45ee6b0bf0ebfed4f8713c6c045b954/server/oauth/google.js#L104
        warningToast({
          title: 'Redirecting you to lit oauth connect UI for login',
        });
        debounce(await redirectToLitOauthUI(daoMetaData, currentAuthSig), 400);
      }

      await callback(currentAuthSig);
    } catch (e) {
      return handleLitServerError(e);
    }
  };

  const handleSignAuthMessage = async () => {
    setLoading(true);
    try {
      await performWithAuthSig(async authSig => {
        setProfile(await handleLoadCurrentUser(authSig));
        setLoading(false);
      });
    } catch (e) {
      errorToast({ title: e.errorCode });
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

  useEffect(() => {
    if (!profile || !daoMetaData?.boosts) {
      setLoading(false);
      return;
    }

    if (daoMetaData && daoMetaData?.boosts?.GOOGLE_LIT.active && profile) {
      getAllGoogleDocs();
    }
  }, [daoMetaData?.boosts, authSig, profile]);

  const LitAuthSigButton = () =>
    isMember && (
      <Flex as={Stack}>
        <Flex as={VStack} spacing={4} alignItems='center'>
          <Button onClick={handleSignAuthMessage}>
            Click to Authneticate Lit Protocol
          </Button>
        </Flex>
      </Flex>
    );

  const addNewGoogleDoc = isMember && authSig && (
    <Flex>
      <Button
        as={Link}
        href={buildLitUrl(daoMetaData, authSig)}
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
