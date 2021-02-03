import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Flex, Box, Text } from '@chakra-ui/react';

import Layout from '../components/layout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import {
  daoConstants,
  daoPresets,
  parseSummonresAndShares,
} from '../utils/summoning';
import SummonHard from '../forms/summonHard';
import SummonEasy from '../forms/summonEasy';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useOverlay } from '../contexts/OverlayContext';
import { SummonService } from '../services/summonService';

const Summon = () => {
  const {
    address,
    injectedChain,
    requestWallet,
    injectedProvider,
  } = useInjectedProvider();
  const { cachePoll, resolvePoll } = useUser();
  const { errorToast, successToast } = useOverlay();
  const [hardMode, setHardMode] = useState(false);
  const [daoData, setDaoData] = useState(null);
  const [isSummoning, setIsSummoning] = useState(false);
  const [summonError, setSummonError] = useState(null);

  if (injectedChain) {
    console.log(
      'daoPresets',
      injectedChain.chain_id,
      daoPresets(injectedChain.chain_id),
    );
  }

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

  const handleSummon = async (data) => {
    setIsSummoning(true);

    const newDaoData = {
      ...daoData,
      ...data,
    };
    setDaoData(newDaoData);
    summonDao(newDaoData);
  };

  const summonDao = async () => {
    const [addrs, shares] = parseSummonresAndShares(daoData.summonerAndShares);

    let summoner;
    let summonerShares;

    if (addrs.length) {
      summoner = addrs;
      summonerShares = shares;
    } else {
      summoner = [address];
      summonerShares = [1];
    }
    const summonData = { ...daoData, summoner, summonerShares };

    console.log('summoning HERE', summonData);

    const summonParams = [
      summonData.summoner,
      summonData.approvedToken.split(',').map((item) => item.trim()),
      summonData.periodDuration,
      summonData.votingPeriod,
      summonData.gracePeriod,
      summonData.proposalDeposit,
      summonData.dilutionBound,
      summonData.processingReward,
      summonData.summonerShares,
    ];
    // await state.service.summonMoloch(summonData, user.username, txCallBack);

    try {
      const poll = createPoll({ action: 'summonMoloch', cachePoll })({
        chainID: injectedChain.chain_id,
        summoner: summonData.summoner[0],
        summoningTime: (new Date().getTime() / 1000).toFixed(),
        actions: {
          onError: (error, txHash) => {
            console.error(`error: ${error}`);
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            setSummonError(error);
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'A new DAO has Risen!',
            });
            // maybe refresh hub data here - need to add that to useUser i think
            // refreshDao();
            resolvePoll(txHash);
          },
        },
      });
      SummonService({
        web3: injectedProvider,
        chainID: injectedChain.chain_id,
      })('summonMoloch')(summonParams, address, poll);
    } catch (err) {
      console.log('error:', err);
    }
  };

  return (
    <Layout>
      <>
        {injectedChain ? (
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
                    />
                  </>
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
                <Box
                  fontSize='3xl'
                  fontFamily='heading'
                  fontWeight={700}
                  mb={10}
                >
                  Our magic internet communities take a minute or two to create.
                  You will soon see new daos on your Hub page.
                </Box>
                <Button as={RouterLink} to='/'>
                  GO TO HUB
                </Button>
              </Box>
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
      </>
    </Layout>
  );
};

export default Summon;
