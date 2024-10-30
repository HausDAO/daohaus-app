import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, Box, Text } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import SummonHard from '../forms/summonHard';
import SummonPending from '../components/summonPending';
import { createPoll } from '../services/pollService';
import { SummonService } from '../services/summonService';
import { DAO_POLL } from '../graphQL/dao-queries';
import { capitalize } from '../utils/general';
import {
  daoConstants,
  daoPresets,
  parseSummonersAndShares,
} from '../utils/summoning';
import { getFormattedOwnersByPaopId } from '../utils/poap-helpers';
import { getGraphEndpoint } from '../utils/chain';
import { graphQuery } from '../utils/apollo';

const SummonPartyFavor = () => {
  const {
    address,
    injectedChain,
    requestWallet,
    injectedProvider,
  } = useInjectedProvider();
  const { cachePoll, resolvePoll, refetchUserHubDaos } = useUser();
  const { errorToast, successToast } = useOverlay();
  const { poapId } = useParams();
  const [daoData, setDaoData] = useState(null);
  const [isSummoning, setIsSummoning] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);
  const [success, setSuccess] = useState(false);
  const [summonError, setSummonError] = useState(null);

  // TODO: REQUIRE XDAI

  useEffect(() => {
    if (injectedChain) {
      const setup = async () => {
        const presets = daoPresets(injectedChain.chain_id);
        const summonerAndShares = await getFormattedOwnersByPaopId(poapId);

        console.log('summonerAndShares', summonerAndShares);
        setDaoData({
          ...daoConstants(injectedChain.chain_id),
          summoner: address,
          ...presets[0],
          proposalDeposit: '0',
          processingReward: '0',
          votingPeriod: '30',
          gracePeriod: '10',
          periodDuration: '60',
          summonerAndShares,
        });
      };

      setup();
    }
  }, [injectedChain]);

  const getnewDaoAddress = async (summoner, now) => {
    try {
      const res = await graphQuery({
        endpoint: getGraphEndpoint(injectedChain.chain_id, 'subgraph_url'),
        query: DAO_POLL,
        variables: {
          summoner,
          createdAt: now,
        },
      });
      setSuccess(res.moloches[0].id);
    } catch (error) {
      console.error(error);
      setSuccess();
    }
  };

  const handleSummon = async data => {
    const now = (new Date().getTime() / 1000).toFixed();
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
      data?.seconds || summonData.periodDuration,
      summonData.votingPeriod,
      summonData.gracePeriod,
      summonData.proposalDeposit,
      summonData.dilutionBound,
      summonData.processingReward,
      summonData.summonerShares,
    ];

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
            getnewDaoAddress(summonData.summoner[0], now);
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

  return (
    <Layout>
      <MainViewLayout header='Summon Party Favor'>
        {injectedChain ? (
          <>
            {!isSummoning ? (
              <>
                <Flex direction='row' justify='space-between'>
                  <Box fontSize='2xl' mb={10}>
                    POAP Event #{poapId}
                  </Box>

                  {summonError ? (
                    <Text as='h1'>{summonError.message || summonError}</Text>
                  ) : null}
                </Flex>

                <>
                  <SummonHard
                    daoData={daoData}
                    setDaoData={setDaoData}
                    handleSummon={handleSummon}
                    networkName={capitalize(injectedChain.network)}
                  />
                </>
              </>
            ) : (
              <SummonPending
                txHash={pendingTx}
                success={success}
                chainId={injectedChain.chain_id}
              />
            )}
          </>
        ) : (
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
        )}
      </MainViewLayout>
    </Layout>
  );
};

export default SummonPartyFavor;
