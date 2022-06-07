import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { RiAddFill } from 'react-icons/ri';
import { Flex, Stack, Button, Link, Spinner } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import BoostNotActive from '../components/boostNotActive';
import MainViewLayout from '../components/mainViewLayout';
import SnapshotCard from '../components/snapshotCard';
import TextBox from '../components/TextBox';

const STANDARD_CONTRACT_TYPE = 'MolochDAOv2.1';
const LIT_API_HOST = ''; // TODO get lit protocol host endpoint

const checkIfUserExists = async authSig => {
  // https://github.com/LIT-Protocol/lit-oauth/blob/51b6efc4c45ee6b0bf0ebfed4f8713c6c045b954/server/oauth/google.js#L172-L194
  try {
    const response = await fetch(
      `${LIT_API_HOST}/api/google/checkIfUserExists`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authSig,
        }),
      },
    );
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

const getUserProfile = async authSig => {
  try {
    const response = await fetch(`${LIT_API_HOST}/api/google/getUserProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authSig }),
    });

    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

// if accessToken is necessary for certain calls (potentially "unshare" document)
const handleLoadCurrentUser = async authSig => {
  const userInfo = await getUserProfile(authSig);
  // check for google drive scope and sign user out if scope is not present
  if (
    userInfo.data['scope'] &&
    userInfo.data['scope'].includes(
      'https://www.googleapis.com/auth/drive.file',
    )
  ) {
    const profileData = JSON.parse(userInfo.data.extraData);
    const accessToken = profileData.accessToken; // if we need jwt access token for some api call
    const userProfile = {
      idOnService: userInfo.data.idOnService,
      email: userInfo.data.email,
      displayName: profileData.displayName,
      avatar: profileData.photoLink,
    };

    await getAllSharedGoogleDocs(authSig, userProfile.idOnService);
  }
};

export const getAllSharedGoogleDocs = async (authSig, idOnService) => {
  try {
    const response = await fetch(`${API_HOST}/api/google/getAllShares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authSig,
        idOnService,
      }),
    });

    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

const LitProtocolGoogle = ({ isMember, daoMetaData, refetchMetaData }) => {
  const { daoid, daochain } = useParams();
  const [loading, setLoading] = useState(true);
  const [googleDocs, setgoogleDocs] = useState({});
  const [showSignatureButton, setShowSignatureButton] = useState(false);
  const [authSig, setAuthSig] = useState(null);
  const { errorToast } = useOverlay();

  useEffect(() => {
    const localAuthSig = localStorage.getItem('authSig');

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
    const getAllGoogleDocs = async () => {
      try {
        const localgoogleDocs = await getAllSharedGoogleDocs();
        //   // daoMetaData?.boosts?.snapshot.metadata.space,
        //   daoMetaData?.boosts?.SNAPSHOT.metadata.space,
        // );
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
    if (
      daoMetaData &&
      // 'snapshot' in daoMetaData?.boosts &&
      // daoMetaData?.boosts?.snapshot.active
      'GOOGLE_LIT' in daoMetaData?.boosts &&
      daoMetaData?.boosts?.GOOGLE_LIT.active
    ) {
      getAllGoogleDocs();
    }
  }, [daoMetaData?.boosts]);

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

  const performWithAuthSig = async (
    callback,
    { chain } = { chain: 'ethereum' },
  ) => {
    let currentAuthSig = authSig;
    if (!currentAuthSig) {
      try {
        currentAuthSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
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
      authSig => {
        handleLoadCurrentUser(authSig);
      },
      { chain: daoMetaData?.chain },
    );
  };

  const LitAuthSigButton = isMember && (
    <Flex>
      <Button
        onClick={handleSignAuthMessage}
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
        to={`/dao/${daochain}/${daoid}/boost/lit-protocol/google/settings`}
      >
        Boost Settings
      </Button> */}
    </Flex>
  );

  return (
    <MainViewLayout
      header='Lit Protocol - Google Docs'
      headerEl={Object.keys(googleDocs).length > 0 && addNewGoogleDoc}
      isDao
    >
      {showSignatureButton ? (
        <Flex justify='space-between' py='2'>
          <Flex
            as={Link}
            to={`/dao/${daochain}/${daoid}/vaults`}
            align='center'
            mb={3}
          >
            <Icon as={BiArrowBack} color='secondary.500' mr={2} />
            All Vaults
          </Flex>
        </Flex>
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
