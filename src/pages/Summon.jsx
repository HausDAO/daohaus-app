import React, { useEffect, useState } from 'react';
import { Button, Flex, Text, Link, Icon, Heading } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import SummonEasy from '../forms/summonEasy';
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
import { getGraphEndpoint } from '../utils/chain';
import { graphQuery } from '../utils/apollo';
import ContentBox from '../components/ContentBox';

const Summon = () => {
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { cachePoll, resolvePoll, refetchUserHubDaos } = useUser();
  const { errorToast, successToast } = useOverlay();
  const [hardMode, setHardMode] = useState(false);
  const [daoData, setDaoData] = useState(null);
  const [isSummoning, setIsSummoning] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);
  const [success, setSuccess] = useState(false);
  const [summonError, setSummonError] = useState(null);

  useEffect(() => {
    if (injectedChain) {
      const presets = daoPresets(injectedChain.chain_id);
      setDaoData({
        ...daoConstants(injectedChain.chain_id),
        summoner: address,
        ...presets[0],
      });
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

    console.log('summonParams', summonParams);

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

  const summonOn = false;

  return (
    <Layout>
      <MainViewLayout header='Summon'>
        {!summonOn && (
          <Flex
            as={ContentBox}
            mt={2}
            direction='column'
            w={['100%', '100%', null, null, '60%']}
          >
            <Heading fontSize='xl' mb='3rem'>
              Why summon a v2 when you could summon a v3?{' '}
            </Heading>
            <Button
              size='lg'
              as={Link}
              color='white'
              href='https://summon.daohaus.club'
              isExternal
              w='250px'
              mb='3rem'
            >
              <Text>
                Summon a v3 here{' '}
                <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
              </Text>
            </Button>
            <Link
              color='white'
              href='https://docs.daohaus.club/v3Upgrade'
              isExternal
              mb='1.5rem'
            >
              <Text fontSize='lg'>
                Let us tell you of the wonders of the new Moloch.{' '}
                <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
              </Text>
            </Link>
            <Link
              color='white'
              href='https://docs.daohaus.club/v3Upgrade'
              isExternal
            >
              <Text fontSize='lg'>
                Learn more about v2 deprecation and migration to v3{' '}
                <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
              </Text>
            </Link>
          </Flex>
        )}
        {injectedChain && summonOn && (
          <>
            {!isSummoning ? (
              <>
                <Flex direction='row' justify='space-between'>
                  <Text>What kind of Haus will you build?</Text>

                  {summonError ? (
                    <Text as='h1'>{summonError.message || summonError}</Text>
                  ) : null}

                  {!hardMode ? (
                    <Flex align='center' mb={2}>
                      <Text mr={3}>Need to fine tune your settings?</Text>
                      <Button variant='solid' onClick={() => setHardMode(true)}>
                        Hard Mode
                      </Button>
                    </Flex>
                  ) : (
                    <Flex align='center' mb={2}>
                      <Text mr={3}>Take me back to </Text>
                      <Button
                        variant='solid'
                        onClick={() => setHardMode(false)}
                      >
                        Fun Mode
                      </Button>
                    </Flex>
                  )}
                </Flex>

                {!hardMode ? (
                  <>
                    <SummonEasy
                      daoData={daoData}
                      setDaoData={setDaoData}
                      handleSummon={handleSummon}
                    />
                  </>
                ) : (
                  <>
                    <SummonHard
                      daoData={daoData}
                      setDaoData={setDaoData}
                      handleSummon={handleSummon}
                      networkName={capitalize(injectedChain.network)}
                    />
                  </>
                )}
              </>
            ) : (
              <SummonPending
                txHash={pendingTx}
                success={success}
                chainId={injectedChain.chain_id}
              />
            )}
          </>
        )}
      </MainViewLayout>
    </Layout>
  );
};

export default Summon;
