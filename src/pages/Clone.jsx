import React, { useEffect, useState } from 'react';
import { Button, Flex, Box, Text } from '@chakra-ui/react';

import { useParams } from 'react-router-dom';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import {
  daoConstants,
  cloneMembers,
  cloneDaoPresets,
  parseSummonersAndShares,
  cloneTokens,
} from '../utils/summoning';
import SummonHard from '../forms/summonHard';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useOverlay } from '../contexts/OverlayContext';
import { SummonService } from '../services/summonService';
import SummonPending from '../components/summonPending';
import { graphQuery } from '../utils/apollo';
import { getGraphEndpoint } from '../utils/chain';
import { DAO_POLL } from '../graphQL/dao-queries';
import MainViewLayout from '../components/mainViewLayout';
import { capitalize } from '../utils/general';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const tokenMsg =
  'Token addresses are different across chains. If you would like to clone the same tokens to a different network, you will need to manually add the equivalent token addresses here.';

const Clone = ({ daoOverview, daoMembers, isUberHaus = false }) => {
  const {
    address,
    injectedChain,
    requestWallet,
    injectedProvider,
  } = useInjectedProvider();
  const { cachePoll, resolvePoll, refetchUserHubDaos } = useUser();
  const { daochain } = useParams();
  const { errorToast, successToast } = useOverlay();
  const [daoData, setDaoData] = useState(null);
  const [isSummoning, setIsSummoning] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);
  const [success, setSuccess] = useState(false);
  const [summonError, setSummonError] = useState(null);
  const now = (new Date().getTime() / 1000).toFixed();

  useEffect(() => {
    if (injectedChain && daoOverview && daoMembers) {
      let tokens = tokenMsg;
      if (isUberHaus) {
        tokens = UBERHAUS_DATA.BURNER_TOKENS;
      } else if (injectedChain.chainId === daochain) {
        tokens = cloneTokens(daoOverview);
      }
      setDaoData({
        ...daoConstants(injectedChain.chain_id),
        summoner: '',
        summonerAndShares: cloneMembers(daoMembers),
        approvedToken: tokens,
        ...cloneDaoPresets(daoOverview),
      });
    }
  }, [injectedChain, daoMembers, daoOverview]);

  const getnewDaoAddress = async () => {
    try {
      const res = await graphQuery({
        endpoint: getGraphEndpoint(injectedChain.chain_id, 'subgraph_url'),
        query: DAO_POLL,
        variables: {
          summoner: address,
          createdAt: now,
        },
      });
      setSuccess(res.moloches[0].id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSummon = async data => {
    console.log(data);
    setIsSummoning(true);
    const newDaoData = {
      ...daoData,
      ...data,
    };
    setDaoData(newDaoData);
    const [addrs, shares] = parseSummonersAndShares(
      newDaoData.summonerAndShares,
    );

    let summoner;
    let summonerShares;

    if (addrs.length) {
      summoner = addrs;
      summonerShares = shares;
    } else {
      summoner = [address];
      summonerShares = [1];
    }
    const summonData = { ...newDaoData, summoner, summonerShares };

    const summonParams = [
      summonData.summoner,
      summonData.approvedToken.split(',').map(item => item.trim()),
      data.seconds || summonData.periodDuration,
      summonData.votingPeriod,
      summonData.gracePeriod,
      summonData.proposalDeposit,
      summonData.dilutionBound,
      summonData.processingReward,
      summonData.summonerShares,
    ];
    console.log(summonParams);

    try {
      const poll = createPoll({ action: 'summonMoloch', cachePoll })({
        chainID: injectedChain.chain_id,
        summoner: summonData.summoner[0],
        createdAt: now,
        actions: {
          onError: (error, txHash) => {
            console.error(`error: ${error}`);
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            setSummonError(error);
          },
          onSuccess: txHash => {
            successToast({
              title: 'A new DAO has Risen!',
            });

            refetchUserHubDaos();
            resolvePoll(txHash);
            getnewDaoAddress();
          },
        },
      });

      const onTxHash = txHash => {
        console.log('tx', txHash);
        setPendingTx(txHash);
      };

      await SummonService({
        web3: injectedProvider,
        chainID: injectedChain.chain_id,
      })('summonMoloch')({
        args: summonParams,
        from: address,
        poll,
        onTxHash,
      });
    } catch (err) {
      console.log('error in tx', err);
      setIsSummoning(false);
      errorToast({
        title: 'There was an error.',
        description: err?.message || '',
      });
    }
  };

  const uberCloneWrongNetwork =
    isUberHaus &&
    injectedChain &&
    injectedChain.chain_id !== UBERHAUS_DATA.NETWORK;

  if (!daoData) {
    return (
      <MainViewLayout header='Clone this DAO'>
        <Box
          rounded='lg'
          bg='blackAlpha.600'
          borderWidth='1px'
          borderColor='whiteAlpha.200'
          p={6}
          m={[10, 'auto', 0, 'auto']}
          w='50%'
          textAlign='center'
        >
          <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
            Connect your wallet to summon a DAO.
          </Box>

          <Flex direction='column' align='center'>
            <Button onClick={requestWallet}>Connect Wallet</Button>
          </Flex>
        </Box>
      </MainViewLayout>
    );
  }

  if (uberCloneWrongNetwork) {
    return (
      <MainViewLayout header='Clone this DAO'>
        <Box
          rounded='lg'
          bg='blackAlpha.600'
          borderWidth='1px'
          borderColor='whiteAlpha.200'
          p={6}
          m={[10, 'auto', 0, 'auto']}
          w='50%'
          textAlign='center'
        >
          <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
            {`Switch your network to ${UBERHAUS_DATA.NETWORK_NAME} to move forward`}
          </Box>
        </Box>
      </MainViewLayout>
    );
  }

  return (
    <MainViewLayout header='Clone this DAO'>
      {summonError && <Text as='h1'>{summonError.message || summonError}</Text>}
      {!isSummoning ? (
        <SummonHard
          daoData={daoData}
          setDaoData={setDaoData}
          handleSummon={handleSummon}
          networkName={capitalize(injectedChain.network)}
          isUberHaus={isUberHaus}
        />
      ) : (
        <SummonPending
          txHash={pendingTx}
          success={success}
          chainId={injectedChain.chain_id}
          isUberHaus={isUberHaus}
        />
      )}
    </MainViewLayout>
  );
};

export default Clone;
