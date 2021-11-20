import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import humanFormat from 'human-format';
import {
  Flex,
  Box,
  Button,
  Skeleton,
  Badge,
  Icon,
  Divider,
  Progress,
  Center,
} from '@chakra-ui/react';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiDashboard2Line,
  RiDashboard3Line,
} from 'react-icons/ri';
import styled from '@emotion/styled';

import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { format } from 'date-fns';

import { numberWithCommas } from '../utils/general';
import {
  determineProposalStatus,
  getProposalCardDetailStatus,
  memberVote,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import ContentBox from './ContentBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { getCustomProposalTerm } from '../utils/metadata';
import { CardLabel, ParaLg, ParaMd, ParaSm } from './typography';
import { getReadableBalance } from '../utils/tokenValue';

const readableNumber = ({ amount, unit }) => {
  if (amount > 0 && amount < 1) {
    return `${Number(amount.toFixed(4))} ${unit}`;
  }
  return `${humanFormat(amount, {
    unit: ` ${unit}`,
    decimals: 1,
    separator: '',
  })}`;
};

const readableTokenBalance = tokenData => {
  const { balance, decimals, symbol } = tokenData || {};
  if (!balance || !decimals || !symbol) return '!! MISSING DATA !!';
  const readableBalance = getReadableBalance(tokenData);
  return readableNumber({ amount: readableBalance, unit: symbol });
};

const checkOffering = () => {};

const checkRequesting = proposal => {
  const {
    paymentRequested,
    paymentTokenDecimals,
    paymentTokenSymbol,
  } = proposal;
  const payReadable = paymentRequested
    ? readableTokenBalance({
        decimals: paymentTokenDecimals,
        balance: paymentRequested,
        symbol: paymentTokenSymbol,
      })
    : null;
  // const shareReadble = getShareReadable(proposal?.paymentRequested);
  // const lootReadable = getLootRequestReadable(proposal?.lootRequested);
  // const lootRequested =
  // const sharesRequested =
};
const checkSpecial = () => {};

const ProposalCardV2 = ({ proposal, customTerms }) => {
  console.log(`proposal`, proposal);
  // const { daochain, daoid } = useParams();
  // const { address } = useInjectedProvider();
  // const [status, setStatus] = useState(null);

  // useEffect(() => {
  //   if (proposal) {
  //     const statusStr = determineProposalStatus(proposal);
  //     setStatus(statusStr);
  //   }
  // }, [proposal]);

  return (
    <ContentBox p='0' mb={4}>
      <Flex>
        <PropCardBrief proposal={proposal} />
        <Center height='100%'>
          <Divider orientation='vertical' />
        </Center>
        <Flex w='40%'>
          <Box px='1.2rem' py='0.6rem' w='100%'>
            <Flex alignItems='center' mb={3}>
              <Box
                borderRadius='50%'
                background='green'
                h='.6rem'
                w='.6rem'
                mr='2'
              />
              <ParaSm fontWeight='700' mr='1'>
                Passed
              </ParaSm>
              <ParaSm>and needs execution </ParaSm>
            </Flex>
            <Progress value={80} mb='3' colorScheme='secondary.500' />
            <Flex justifyContent='space-between'>
              <Button
                size='sm'
                minW='64px'
                backgroundColor='white'
                color='black'
              >
                No
              </Button>
              <Button
                size='sm'
                minW='64px'
                color='secondary.500'
                variant='outline'
              >
                Abstain
              </Button>
              <Button size='sm' minW='64px'>
                Yes
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </ContentBox>
  );
};

const PropCardBrief = ({ proposal }) => {
  const requesting = checkRequesting(proposal);
  const offering = checkOffering(proposal);
  const special = (requesting && offering) || checkSpecial(proposal);

  return (
    <Flex
      width='60%'
      justifyContent='space-between'
      borderRight='1px solid rgba(255,255,255,0.3)'
    >
      <Box px='1.2rem' py='0.6rem'>
        <CardLabel>{proposal.proposalType}</CardLabel>
        <ParaMd fontWeight='700'>{proposal.title}</ParaMd>
      </Box>
      <Box px='1.2rem' py='0.6rem'>
        <Button
          variant='ghost'
          p='0'
          size='sm'
          fontSize='.85rem'
          fontWeight='400'
          color='secondary.400'
          transform='translateY(-.4rem)'
        >
          More Details
        </Button>
      </Box>
    </Flex>
  );
};

export default ProposalCardV2;

const things = (
  <Flex w='100%' wrap='wrap'>
    <Flex direction='column' w={['100%', null, null, '60%']} p={3}>
      <Flex justify='space-between'>
        <Box
          fontSize='xs'
          textTransform='uppercase'
          fontFamily='heading'
          letterSpacing='0.1em'
        >
          Proposal Type
        </Box>
        <Link to='/proposals'>
          <Box fontSize='xs' color='secondary.500'>
            <strong>More Details</strong>
          </Box>
        </Link>
      </Flex>
      <Box fontWeight={700} fontSize='sm' fontFamily='heading' mt={3}>
        This proposal title is intentionally long in order to test the limits of
        the layout.
      </Box>
      <Box mt={3}>
        <Flex align='center'>
          <RiArrowRightLine style={{ marginRight: '5px' }} /> Offering 1.5 WETH
        </Flex>
        <Flex align='center'>
          <RiArrowLeftLine style={{ marginRight: '5px' }} /> Requesting 100
          shares, 4900 Loot
        </Flex>
      </Box>
    </Flex>

    <Flex
      direction='column'
      w={['100%', null, null, '40%']}
      align='start'
      justify='space-between'
      borderLeft={['none', null, null, '1px solid rgba(255,255,255,0.2)']}
      borderTop={['1px solid rgba(255,255,255,0.2)', null, null, 'none']}
      p={3}
    >
      <Flex align='center' justify='space-between' w='100%'>
        <Box fontSize='xs'>
          <Badge mb='1'>Voting</Badge>
          <strong>
            <i>Voting</i>
          </strong>{' '}
          <i>ends in 5 hours</i>
        </Box>
        <Box fontSize='xl' color='secondary.500'>
          <RiDashboard3Line />
        </Box>
      </Flex>
      <Flex align='center' w='100%'>
        <Box
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255,255,255,0.25',
          }}
        />
      </Flex>
      <Flex w='100%' justify='space-between'>
        <Button variant='primary' size='sm'>
          No
        </Button>
        <Button variant='ghost' size='sm'>
          Abstain
        </Button>
        <Button variant='primary' size='sm'>
          Yes
        </Button>
      </Flex>
      <Flex align='center'>
        <Box fontSize='xs'>
          <i>Submit your vote</i>
        </Box>
      </Flex>
    </Flex>
  </Flex>
);
