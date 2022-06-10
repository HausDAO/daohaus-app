import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { RiAddFill } from 'react-icons/ri';
import { Flex, Stack, Button, Link, Spinner } from '@chakra-ui/react';
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
  googleLitSignOut,
} from '../utils/litProtocol';
import GoogleLitCard from '../components/GoogleLitCard';

const LitProtocolGoogle = ({ isMember, daoMetaData, refetchMetaData }) => {
  const { daoid, daochain } = useParams();
  const [loading, setLoading] = useState(true);
  const [googleDocs, setgoogleDocs] = useState({});
  const [showSignatureButton, setShowSignatureButton] = useState(true);
  const [authSig, setAuthSig] = useState(null);
  const [profile, setProfile] = useState(null);
  const { errorToast } = useOverlay();

  useEffect(() => {
    const localAuthSig = loadStoredAuthSig();

    if (localAuthSig) {
      setAuthSig(localAuthSig);
      if (checkIfUserExists(localAuthSig)) {
        setProfile(handleLoadCurrentUser(localAuthSig));
        setShowSignatureButton(false);
      }
    } else {
      setShowSignatureButton(true);
    }
  }, []);

  useEffect(() => {
    if (!profile?.idOnService || !authSig?.sig || !daoMetaData?.boosts) {
      setLoading(false);
      return;
    }
    const getAllGoogleDocs = async () => {
      try {
        setgoogleDocs(await getSharedGoogleDocs(authSig, profile?.idOnService));
        setLoading(false);
        setShowSignatureButton(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        errorToast({
          title: 'Fetching google docs failed',
        });
      }

      setLoading(false);
    };

    if (
      daoMetaData &&
      daoMetaData?.boosts?.GOOGLE_LIT.active &&
      profile?.idOnService &&
      authSig?.sig
    ) {
      getAllGoogleDocs();
    }
  }, [daoMetaData, authSig, profile]);

  const performWithAuthSig = async (
    callback,
    { chain } = { chain: 'ethereum' },
  ) => {
    let currentAuthSig = authSig;
    if (!currentAuthSig) {
      try {
        currentAuthSig = await LitJsSdk.checkAndSignAuthMessage({
          chain,
        });
        setAuthSig(currentAuthSig);
      } catch (e) {
        if (e.code === 4001) {
          // redirect to lit oauth connect UI
          // window.location = 'https://litgateway.com/apps';
          errorToast({
            title: 'Could not connect to Lit Protocol -> redirect',
          });
          return;
        }
        if (e?.errorCode === 'no_wallet') {
          errorToast({ title: 'You need a wallet to use the Lit Protocol' });
          return false;
        } else if (e?.errorCode === 'wrong_network') {
          errorToast({ title: e.message });
          return false;
        } else {
          console.log(e);
          throw e;
        }
      }
    }

    return await callback(currentAuthSig);
  };

  const handleSignAuthMessage = async () => {
    setLoading(true);
    await performWithAuthSig(
      async authSig => {
        const user = await handleLoadCurrentUser(authSig);
        setProfile(user);
        setLoading(false);
      },
      {
        chain: daoMetaData?.network,
      },
    );
  };

  const handleSignOut = async () => {
    googleLitSignOut();
    setProfile(null);
    setAuthSig(null);
    setShowSignatureButton(true);
  };

  console.log(googleDocs);

  const LitAuthSigButton = () =>
    isMember && (
      <Flex>
        <Button
          onClick={handleSignAuthMessage}
          rightIcon={<RiAddFill />}
          isExternal
          mr={10}
        >
          Sign In
        </Button>
      </Flex>
    );

  const addNewGoogleDoc = isMember && (
    <Flex>
      <Button
        as={Link}
        href={`https://oauth-app.litgateway.com/google?source=daohaus&dao_address=${daoMetaData?.address}&dao_name=${daoMetaData?.name}&contract_type=${STANDARD_CONTRACT_TYPE}`}
        rightIcon={<RiAddFill />}
        isExternal
        mr={10}
      >
        Share Google Drive Item
      </Button>

      {profile && (
        <Button
          onClick={handleSignOut}
          rightIcon={<RiAddFill />}
          isExternal
          mr={10}
        >
          Sign Out
        </Button>
      )}
    </Flex>
  );

  return (
    <MainViewLayout
      header='Lit Protocol - Google Docs'
      headerEl={Object.keys(googleDocs).length > 0 && addNewGoogleDoc}
      isDao
    >
      <Flex as={Stack} direction='column' spacing={4} w='100%'>
        {showSignatureButton && <LitAuthSigButton />}
        {!loading ? (
          // daoMetaData && 'googleLit' in daoMetaData?.boosts ? (
          daoMetaData && daoMetaData?.boosts?.GOOGLE_LIT?.active ? (
            Object.keys(googleDocs).length > 0 ? (
              Object.values(googleDocs)
                .slice(0, 10)
                .map(
                  googleDoc =>
                    googleDoc && (
                      <GoogleLitCard
                        key={googleDoc?.id}
                        googleDoc={googleDoc}
                      />
                    ),
                )
            ) : (
              <Flex mt='100px' w='100%' justify='center'>
                <TextBox variant='value' size='lg'>
                  No Google Docs found.
                </TextBox>
              </Flex>
            )
          ) : (
            <BoostNotActive />
          )
        ) : (
          <Spinner size='xl' />
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default LitProtocolGoogle;
