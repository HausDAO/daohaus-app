import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Flex, Box, Text } from '@chakra-ui/react';

import Layout from '../components/layout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConstants, parseSummonresAndShares } from '../utils/summoning';
import SummonHard from '../forms/summonHard';
import SummonEasy from '../forms/summonEasy';

const Summon = () => {
  const { address, injectedChain, requestWallet } = useInjectedProvider();
  const [hardMode, setHardMode] = useState(false);
  const [daoData, setDaoData] = useState(null);
  const [isSummoning, setIsSummoning] = useState(false);
  const [summonError, setSummonError] = useState(null);

  useEffect(() => {
    if (injectedChain) {
      setDaoData(daoConstants(injectedChain.chain_id));
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
    // await state.service.summonMoloch(summonData, user.username, txCallBack);
  };

  return (
    <Layout>
      <>
        {address ? (
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
