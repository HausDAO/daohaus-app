import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  Icon,
  useToast,
  // Button,
  Avatar,
  // List,
  // ListItem,
  Link,
  HStack,
  Stack,
  Button,
  // Stack,
  // Text,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { RiArrowLeftLine } from 'react-icons/ri';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { truncateAddr } from '../utils/general';
import { FaCopy } from 'react-icons/fa';

import makeBlockie from 'ethereum-blockies-base64';
import MainViewLayout from '../components/mainViewLayout';
import BankList from '../components/BankList';
import { initTokenData } from '../utils/tokenValue';

import MinionTokenList from '../components/minionTokenList';

import { getBlockScoutTokenData } from '../utils/tokenExplorerApi';

const MinionDetails = ({ overview, members, currentDaoTokens }) => {
  // const [web3Connect] = useWeb3Connect();
  // const { modals, openModal } = useModals();
  const { daochain, daoid, minion } = useParams();
  const toast = useToast();
  const [minionData, setMinionData] = useState();
  const [minionBalances, setMinionBalances] = useState();
  const [contractBalances, setContractBalances] = useState();

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
    console.log('daoMembers', members);
    console.log('minion', minion);
    const setUpBalances = async () => {
      const _minionBalances = members.find((member) => {
        if (member.memberAddress === minion) {
          return member.tokenBalances;
        }
      });
      console.log('_minionBalances', _minionBalances);
      let newTokenData;
      if (_minionBalances) {
        newTokenData = await initTokenData(_minionBalances.tokenBalances);
      } else {
        newTokenData = [];
      }

      console.log('newTokenData', newTokenData);
      setMinionBalances(newTokenData);
    };

    if (members) {
      setUpBalances();
    }
    // eslint-disable-next-line
  }, [members, minion]);

  useEffect(() => {
    const getContractBalance = async () => {
      try {
        if (daochain === '0x1' || daochain === '0x4' || daochain === '0x2a') {
          // not supported yet
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
            <TextBox size='md' align='center'>
              {' '}
              Settings (under construction ( ͡° ͜ʖ ͡°) )
            </TextBox>
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
                  Internal balances in DAOs (for withdraw)
                </TextBox>
                {minionBalances ? (
                  <BankList
                    tokens={minionBalances}
                    hasBalance={false}
                    profile={true}
                  />
                ) : null}
              </Box>
              <Box>
                <Stack spacing={6}>
                  <Stack spacing={2}>
                    <Button>Add Another DAO</Button>
                  </Stack>

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
