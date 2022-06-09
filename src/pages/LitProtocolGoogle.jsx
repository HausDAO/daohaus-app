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
  getAllSharedGoogleDocs,
  STANDARD_CONTRACT_TYPE,
  storeAuthSig,
  loadStoredAuthSig,
} from '../utils/litProtocol';

const LitProtocolGoogle = ({ isMember, daoMetaData, refetchMetaData }) => {
  const { daoid, daochain } = useParams();
  const [loading, setLoading] = useState(true);
  const [googleDocs, setgoogleDocs] = useState({});
  const [showSignatureButton, setShowSignatureButton] = useState(false);
  const [authSig, setAuthSig] = useState(null);
  const [litProtocolClient, setLitProtocolClient] = useState(null);
  const { errorToast } = useOverlay();

  const getAllGoogleDocs = async () => {
    try {
      const localgoogleDocs = await getAllSharedGoogleDocs();
      setgoogleDocs(localgoogleDocs);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      errorToast({
        title: 'Fetching google docs failed',
      });
    }
  };

  useEffect(() => {
    const loadLitClient = async () => {
      // potentially build a client incorporate error handling
      // https://developer.litprotocol.com/docs/LitTools/JSSDK/errorHandling
      const client = new LitJsSdk.LitNodeClient();
      await client.connect();
      setLitProtocolClient(client);
    };

    loadLitClient();
  }, []);

  useEffect(() => {
    const localAuthSig = loadStoredAuthSig();

    if (localAuthSig) {
      setAuthSig(localAuthSig);
      checkIfUserExists(authSig)
        .then(res => {
          if (res.data.status === 'success') {
            handleLoadCurrentUser(authSig);
            setShowSignatureButton(false);
          } else {
            errorToast(res.data.message);
          }
        })
        .catch(err => {
          errorToast(err.message);
        });
    } else {
      setShowSignatureButton(true);
    }
  }, [authSig]);

  useEffect(() => {
    if (
      daoMetaData &&
      'GOOGLE_LIT' in daoMetaData?.boosts &&
      daoMetaData?.boosts?.GOOGLE_LIT.active
    ) {
      getAllGoogleDocs();
    }
  }, [daoMetaData?.boosts]);

  const performWithAuthSig = async (
    callback,
    { chain } = { chain: 'ethereum' },
  ) => {
    let currentAuthSig = authSig;
    if (!currentAuthSig) {
      try {
        currentAuthSig = await litProtocolClient.checkAndSignAuthMessage({
          chain,
        });
        storeAuthSig(currentAuthSig);
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
          throw e;
        }
      }
    }

    return await callback(currentAuthSig);
  };

  const handleSignAuthMessage = async () => {
    await performWithAuthSig(
      async authSig => await handleLoadCurrentUser(authSig),
      {
        chain: daoMetaData?.chain,
      },
    );
  };

  console.log(googleDocs);

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
      {/*
      <Button
        as={RouterLink}
        to={`/dao/${daochain}/${daoid}/boost/snapshot/settings`}
      >
        Boost Settings
      </Button> */}
    </Flex>
  );

  const LitAuthSigButton = () =>
    isMember ? (
      <Flex>
        <Button
          onClick={handleSignAuthMessage}
          href={`https://oauth-app.litgateway.com/google?source=daohaus&dao_address=${daoMetaData?.address}&dao_name=${daoMetaData?.name}&contract_type=${STANDARD_CONTRACT_TYPE}`}
          rightIcon={<RiAddFill />}
          isExternal
          mr={10}
        >
          Sign
        </Button>
        {/*
      <Button
        as={RouterLink}
        to={`/dao/${daochain}/${daoid}/boost/lit-protocol/google/settings`}
      >
        Boost Settings
      </Button> */}
      </Flex>
    ) : (
      <Flex>You are not a member of this Dao</Flex>
    );

  return (
    <MainViewLayout
      header='Lit Protocol - Google Docs'
      headerEl={Object.keys(googleDocs).length > 0 && addNewGoogleDoc}
      isDao
    >
      {showSignatureButton ? (
        <LitAuthSigButton />
      ) : (
        <Flex as={Stack} direction='column' spacing={4} w='100%'>
          {!loading ? (
            // daoMetaData && 'googleLit' in daoMetaData?.boosts ? (
            daoMetaData && 'GOOGLE_LIT' in daoMetaData?.boosts ? (
              Object.keys(googleDocs).length > 0 ? (
                Object.values(googleDocs)
                  .slice(0, 10)
                  .map(googleLit => ({
                    /* <SnapshotCard
                      key={googleLit.id}
                      googleLitId={googleLit.od}
                      googleLit={googleLit}
                    /> */
                  }))
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
      )}
    </MainViewLayout>
  );
};

export default LitProtocolGoogle;
