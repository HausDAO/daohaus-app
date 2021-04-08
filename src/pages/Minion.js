import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  Icon,
  useToast,
  Avatar,
  Link,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { RiArrowLeftLine } from 'react-icons/ri';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { truncateAddr } from '../utils/general';
import { FaCopy } from 'react-icons/fa';

import makeBlockie from 'ethereum-blockies-base64';
import MainViewLayout from '../components/mainViewLayout';
// import { initTokenData } from '../utils/tokenValue';

import MinionTokenList from '../components/minionTokenList';

import { getBlockScoutTokenData } from '../utils/tokenExplorerApi';
import { supportedChains } from '../utils/chain';
import { balanceChainQuery } from '../utils/theGraph';
import HubBalanceList from '../components/hubBalanceList';
import { useOverlay } from '../contexts/OverlayContext';
import { createPoll } from '../services/pollService';
import { MinionService } from '../services/minionService';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';

const MinionDetails = ({ overview, members, currentDaoTokens }) => {
  // const [web3Connect] = useWeb3Connect();
  // const { modals, openModal } = useModals();
  const { daochain, daoid, minion } = useParams();
  const toast = useToast();
  const [minionData, setMinionData] = useState();
  const [daoBalances, setDaoBalances] = useState();
  const [contractBalances, setContractBalances] = useState();
  const [balancesGraphData, setBalanceGraphData] = useState({
    chains: [],
    data: [],
  });
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { cachePoll, resolvePoll } = useUser();
  const now = (new Date().getTime() / 1000).toFixed();
  const { refreshDao } = useTX();
  const { address, injectedProvider } = useInjectedProvider();

  const hasLoadedBalanceData =
    balancesGraphData.chains.length === Object.keys(supportedChains).length;

  useEffect(() => {
    if (!overview?.minions.length) {
      return;
    }
    const _minionData = overview?.minions.find((m) => {
      return m.minionAddress === minion;
    });
    setMinionData(_minionData);
  }, [overview, minion]);

  useEffect(() => {
    const getContractBalance = async () => {
      try {
        if (daochain === '0x1' || daochain === '0x4' || daochain === '0x2a') {
          // eth chains not supported yet
          // may need to do something different for matic too
          setContractBalances([]);
        } else {
          setContractBalances(await getBlockScoutTokenData(minion));
        }
      } catch (err) {
        console.log(err);
      }
    };
    getContractBalance();
  }, [minion]);

  useEffect(() => {
    console.log('get minion balance', minion);
    if (minion) {
      balanceChainQuery({
        reactSetter: setBalanceGraphData,
        address: minion,
      });
    }
  }, [minion]);

  useEffect(() => {
    if (hasLoadedBalanceData) {
      const tokenBalances = balancesGraphData.data
        .flatMap((bal) => {
          return bal.tokenBalances.map((b) => {
            return { ...b, moloch: bal.moloch, meta: bal.meta };
          });
        })
        .filter((bal) => +bal.tokenBalance > 0);

      setDaoBalances(tokenBalances);
    }
  }, [hasLoadedBalanceData]);

  const refreshGraphBalances = () => {
    setBalanceGraphData({
      chains: [],
      data: [],
    });
    balanceChainQuery({
      reactSetter: setBalanceGraphData,
      address: minion,
    });
  };

  const withdraw = async (token, transfer) => {
    const args = [
      token.moloch.id,
      token.token.tokenAddress,
      token.tokenBalance,
      transfer,
    ];
    try {
      const poll = createPoll({ action: 'minionCrossWithdraw', cachePoll })({
        tokenAddress: token.token.tokenAddress,
        memberAddress: minion,
        daoID: token.moloch.id,
        expectedBalance: 0,
        minionAddress: minion,
        createdAt: now,
        chainID: daochain,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'Minion proposal submitted.',
            });
            refreshDao();
            resolvePoll(txHash);
            refreshGraphBalances();
          },
        },
      });
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion: minion,
        chainID: daochain,
      })('crossWithdraw')({ args, address, poll, onTxHash });
    } catch (err) {
      // setLoading(false);
      console.log('error: ', err);
    }
  };

  return (
    <MainViewLayout header='Minion' isDao={true}>
      <Box>
        <Link as={RouterLink} to={`/dao/${daochain}/${daoid}/settings`}>
          <HStack spacing={3}>
            <Icon
              name='arrow-back'
              color='primary.50'
              as={RiArrowLeftLine}
              h='20px'
              w='20px'
            />
          </HStack>
        </Link>
        <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
          {minionData ? (
            <>
              <Flex
                p={4}
                justify='space-between'
                align='center'
                key={minionData.minionAddress}
              >
                <Box>
                  <Flex align='center'>
                    <Avatar
                      name={minionData.minionAddress}
                      src={makeBlockie(minionData.minionAddress)}
                      mr={3}
                    />
                    <Heading>{minionData.details}</Heading>
                  </Flex>
                </Box>
                <Flex align='center'>
                  <TextBox size='md' colorScheme='whiteAlpha.900'>
                    {minionData.minionType}:{' '}
                    <Box as='span' color='primary.100'>
                      {truncateAddr(minionData.minionAddress)}
                    </Box>
                  </TextBox>
                  <CopyToClipboard
                    text={minionData.minionAddress}
                    onCopy={() =>
                      toast({
                        title: 'Copied Minion Address',
                        position: 'top-right',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      })
                    }
                  >
                    <Icon
                      as={FaCopy}
                      color='secondary.300'
                      ml={2}
                      _hover={{ cursor: 'pointer' }}
                    />
                  </CopyToClipboard>
                </Flex>
              </Flex>
              <Box>
                <TextBox size='md' align='center'>
                  Unclaimed balances in DAOs (for withdraw)
                </TextBox>
                <HubBalanceList
                  tokens={daoBalances}
                  withdraw={withdraw}
                  currentDaoTokens={currentDaoTokens}
                />
              </Box>
              <Box pt={6}>
                <Stack spacing={6}>
                  <Box>
                    <TextBox size='md' align='center'>
                      Minion wallet
                    </TextBox>

                    {contractBalances && (
                      <MinionTokenList tokens={contractBalances} />
                    )}
                  </Box>
                </Stack>
              </Box>
            </>
          ) : (
            <Flex justify='center'>
              <Box fontFamily='heading'>No minion found</Box>
            </Flex>
          )}
        </ContentBox>
      </Box>
    </MainViewLayout>
  );
};

export default MinionDetails;
