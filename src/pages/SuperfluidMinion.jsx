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
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { RiArrowLeftLine, RiQuestionLine } from 'react-icons/ri';

import BankList from '../components/BankList';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import SuperTokenList from '../components/superTokenList';
import StreamList from '../components/StreamList';
import { ToolTipWrapper } from '../staticElements/wrappers';

import { SuperfluidMinionService } from '../services/superfluidMinionService';
import { truncateAddr } from '../utils/general';
import { initTokenData } from '../utils/tokenValue';
import { SF_LABEL } from '../utils/toolTipLabels';

const SuperfluidMinionDetails = ({
  activities,
  overview,
  daoMember,
  members,
}) => {
  const [loading, setLoading] = useState({
    active: false,
    proposalId: null,
  });
  const [loadingStreams, setLoadingStreams] = useState(true);
  const { daochain, daoid, minion } = useParams();
  const toast = useToast();
  const [minionData, setMinionData] = useState();
  const [superTokenBalances, setSuperTokenBalances] = useState();
  const [minionBalances, setMinionBalances] = useState();
  const [streamList, setStreamList] = useState();

  useEffect(() => {
    if (!overview?.minions.length) {
      return;
    }
    const minionDetails = overview?.minions.find(m => {
      return m.minionAddress === minion;
    });
    setMinionData(minionDetails);
  }, [overview, minion]);

  useEffect(() => {
    if (daoid && minion && activities) {
      setLoadingStreams(true);
      try {
        const fetchStreams = async () => {
          const cfaStreams = await SuperfluidMinionService({
            minion,
            chainID: daochain,
          })('fetchStreams')({ molochAddress: daoid });
          const streams = cfaStreams.flows.map(s => {
            const proposal = activities?.proposals?.find(
              p => p.proposalId === s.proposalId,
            );
            if (proposal) {
              const details = JSON.parse(proposal.details);
              s.rateStr = details.tokenRate;
            }
            return s;
          });
          if (streams) {
            setSuperTokenBalances(cfaStreams.superTokens);
            setStreamList(streams);
          }
          setLoadingStreams(false);
        };
        fetchStreams();
      } catch (err) {
        setLoadingStreams(false);
        console.log('error: ', err);
      }
    }
  }, [daoid, minion, activities]);

  useEffect(() => {
    const setUpBalances = async () => {
      const balances = members.find(member => member.memberAddress === minion);
      const newTokenData = balances
        ? await initTokenData(balances.tokenBalances)
        : [];
      setMinionBalances(newTokenData);
    };

    if (members) {
      setUpBalances();
    }
  }, [members, minion]);

  const handleCopyToast = () => {
    toast({
      title: 'Copied Minion Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <MainViewLayout header='Minion' isDao>
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
              Settings
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
                  <TextBox size='md' color='whiteAlpha.900'>
                    {minionData.minionType}:{' '}
                    <Box as='span' color='primary.100'>
                      {truncateAddr(minionData.minionAddress)}
                    </Box>
                  </TextBox>
                  <CopyToClipboard
                    text={minionData.minionAddress}
                    onCopy={handleCopyToast}
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
                <Flex pt={4}>
                  <TextBox size='md'>Token Balances</TextBox>
                  <ToolTipWrapper
                    placement='right'
                    tooltip
                    tooltipText={SF_LABEL.TOKEN_BALANCES}
                  >
                    <RiQuestionLine />
                  </ToolTipWrapper>
                </Flex>
                {minionBalances && (
                  <BankList
                    tokens={minionBalances}
                    hasBalance={false}
                    profile
                  />
                )}
              </Box>
              <SuperTokenList
                superTokenBalances={superTokenBalances}
                loadingStreams={loadingStreams}
                handleCopyToast={handleCopyToast}
                loading={loading}
                setLoading={setLoading}
                daoMember={daoMember}
                minionBalances={minionBalances}
              />
              <StreamList
                list={streamList}
                daoMember={daoMember}
                loadingStreams={loadingStreams}
                balances={superTokenBalances}
              />
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

export default SuperfluidMinionDetails;
