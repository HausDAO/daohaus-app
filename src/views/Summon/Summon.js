import React, { useState, useContext, useEffect } from 'react';
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';

import { daoConstants, daoPresets } from '../../content/summon-presets';
import { SummonContext } from '../../contexts/SummonContext';
import HardModeForm from '../../components/Summon/HardModeForm';
import {
  useNetwork,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import SummonService from '../../utils/summon-service';
import SummonSettings from '../../components/Summon/SummonSettings';

const Summon = () => {
  const [user] = useUser();
  const [network] = useNetwork();
  const [w3Context] = useWeb3Connect();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [hardMode, setHardMode] = useState(false);
  const [daoData, setDaoData] = useState(daoConstants(network.network_id));
  const [isSummoning, setIsSummoning] = useState(false);
  const [summonError, setSummonError] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const { state, dispatch } = useContext(SummonContext);
  // use network to init service

  const stepContent = {
    1: 'What kind of Haus will you build?',
    4: 'Our magic internet communities take a minute or two to create. You will soon see new daos on your Hub page',
  };

  const handleSummon = async (data) => {
    setCurrentStep(4);
    setIsSummoning(true);

    setDaoData((prevState) => {
      return {
        ...prevState,
        ...data,
        summon: true,
      };
    });
  };

  const parseSummonresAndShares = (data) => {
    if (!data) {
      return [[], []];
    }
    const lines = data.split('\n');
    const addrs = [];
    const amounts = [];
    lines.forEach((line) => {
      const summoner = line.split(' ');
      addrs.push(summoner[0]);
      amounts.push(summoner[1]);
    });
    return [addrs, amounts];
  };

  useEffect(() => {
    if (user?.username) {
      const presets = daoPresets(network.network_id);
      setDaoData({ ...daoData, summoner: user.username, ...presets[0] });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (network?.network_id && w3Context?.web3) {
      const summonService = new SummonService(
        w3Context.web3,
        network.network_id,
      );
      dispatch({ type: 'setService', payload: summonService });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w3Context, network]);

  useEffect(() => {
    const txCallBack = (txHash, details) => {
      console.log('txCallBack', txProcessor);
      if (txProcessor && txHash) {
        txProcessor.setTx(txHash, user.username, details, true, false, false);
        txProcessor.forceCheckTx = true;
        // state.service.cacheNewMoloch(newMoloch)
        updateTxProcessor(txProcessor);
      }
      if (!txHash) {
        console.log('error: ', details);
        setSummonError(details?.message);
        setIsSummoning(false);
        setCurrentStep(1);
      }
    };

    const summonDao = async () => {
      const [addrs, shares] = parseSummonresAndShares(
        daoData.summonerAndShares,
      );
      if (addrs.length) {
        daoData.summoner = addrs;
        daoData.summonerShares = shares;
      } else {
        daoData.summoner = [daoData.summoner];
        daoData.summonerShares = [1];
      }

      console.log('summoning HERE', daoData);
      await state.service.summonMoloch(daoData, user.username, txCallBack);
    };

    if (daoData.summon) {
      summonDao();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoData]);

  useEffect(() => {
    if (state.status === 'error') {
      setIsSummoning(false);
      setCurrentStep(1);
    }

    if (state.status === 'complete') {
      dispatch({ type: 'clearState' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Box p={6}>
      {user && user.username ? (
        <Box>
          <Box className='Summon__hero'>
            <Heading as='h1'>SUMMON</Heading>
          </Box>

          <Box className='View Summon'>
            <Box className='Row'>
              <Box className='Summon__step'>
                <Flex direction='row' justify='space-between'>
                  <Text>{stepContent[currentStep]}</Text>
                  {currentStep === 1 ? (
                    <>
                      {!hardMode ? (
                        <Flex align='center' mb={2}>
                          <Text mr={3}>Need to fine tune your settings?</Text>
                          <Button
                            variant='solid'
                            onClick={() => setHardMode(true)}
                          >
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
                    </>
                  ) : null}
                </Flex>
              </Box>
            </Box>

            {state.status === 'error' ? (
              <Heading as='h1'>
                {state.errorMessage.message || state.errorMessage}
              </Heading>
            ) : null}
            {summonError && (
              <Heading as='h1'>{summonError.message || summonError}</Heading>
            )}

            {!isSummoning ? (
              <>
                {!hardMode ? (
                  <>
                    {currentStep === 1 ? (
                      <SummonSettings
                        daoData={daoData}
                        setDaoData={setDaoData}
                        handleSummon={handleSummon}
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    <HardModeForm
                      daoData={daoData}
                      setDaoData={setDaoData}
                      handleSummon={handleSummon}
                    />
                  </>
                )}
              </>
            ) : null}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default Summon;
