import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import humanFormat from 'human-format';
import {
  Flex,
  Box,
  Button,
  Divider,
  Progress,
  Center,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

import ContentBox from './ContentBox';
import { Bold, CardLabel, ParaMd, ParaSm } from './typography';
import { getReadableBalance } from '../utils/tokenValue';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { createContract } from '../utils/contract';
import { getMinionAbi } from '../utils/abi';
import useMinionAction from '../hooks/useMinionAction';
import { CUSTOM_DISPLAY } from '../data/proposalData';

const readableNumber = ({ amount, unit, decimals = 1, separator = '' }) => {
  if (!amount || !unit) return null;
  if (amount > 0 && amount < 1) {
    return `${Number(amount.toFixed(4))} ${unit}`;
  }
  return `${humanFormat(amount, {
    unit: ` ${unit}`,
    decimals,
    separator,
  })}`;
};
const readableTokenBalance = tokenData => {
  const { balance, decimals, symbol } = tokenData || {};
  if (!balance || !decimals || !symbol) return null;
  const readableBalance = getReadableBalance(tokenData);
  if (!readableBalance) return null;
  return readableNumber({ amount: readableBalance, unit: symbol });
};

const generateRequestText = proposal => {
  const {
    paymentRequested,
    paymentTokenDecimals,
    paymentTokenSymbol,
    sharesRequested,
    lootRequested,
  } = proposal;
  const paymentReadable = Number(paymentRequested)
    ? readableTokenBalance({
        decimals: paymentTokenDecimals,
        balance: paymentRequested,
        symbol: paymentTokenSymbol,
      })
    : '';

  const sharesReadable = Number(sharesRequested)
    ? readableNumber({ unit: 'Shares', amount: Number(sharesRequested) })
    : '';
  const lootReadable = Number(lootRequested)
    ? readableNumber({ unit: 'Loot', amount: Number(lootRequested) })
    : '';

  return [sharesReadable, lootReadable, paymentReadable]
    .filter(Boolean)
    .join(', ');
};

const generateOfferText = proposal => {
  const { tributeOffered, tributeTokenDecimals, tributeTokenSymbol } = proposal;
  const tributeReadable = Number(tributeOffered)
    ? readableTokenBalance({
        decimals: tributeTokenDecimals,
        balance: tributeOffered,
        symbol: tributeTokenSymbol,
      })
    : '';
  //  'NFT offered' logic here
  const text = [tributeReadable].filter(Boolean).join(', ');
  return text;
};

const checkSpecial = () => {};

const ProposalCardV2 = ({ proposal, customTerms }) => {
  return (
    <ContentBox p='0' mb={4} minHeight='8.875rem'>
      <Flex>
        <PropCardBrief proposal={proposal} />
        <Center height='100%' minHeight='8.875rem'>
          <Divider orientation='vertical' colorScheme='blackAplha.900' />
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
                minW='4rem'
                backgroundColor='white'
                color='black'
              >
                No
              </Button>
              <Button
                size='sm'
                minW='4rem'
                color='secondary.500'
                variant='outline'
              >
                Abstain
              </Button>
              <Button size='sm' minW='4rem'>
                Yes
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </ContentBox>
  );
};

const DetailsLink = ({ proposalId }) => {
  const { daochain, daoid } = useParams();
  return (
    <Box position='absolute' top='0.5rem' right='1rem'>
      <Link to={`/dao/${daochain}/${daoid}/proposals/${proposalId}`}>
        <ParaSm>More Details</ParaSm>
      </Link>
    </Box>
  );
};

const PropCardBrief = ({ proposal = {} }) => {
  const isOffering = Number(proposal.tributeOffered) > 0;
  const isRequesting =
    Number(proposal.lootRequested) > 0 ||
    Number(proposal.sharesRequested) > 0 ||
    Number(proposal.paymentRequested) > 0;
  const { customTransferUI } = CUSTOM_DISPLAY[proposal.proposalType] || {};

  return (
    <Flex
      width='60%'
      justifyContent='space-between'
      borderRight='1px solid rgba(255,255,255,0.1)'
      position='relative'
    >
      <Box px='1.2rem' py='0.6rem'>
        <CardLabel mb={1}>{proposal.proposalType}</CardLabel>
        <ParaMd fontWeight='700' mb={1}>
          {proposal.title}
        </ParaMd>
        {isRequesting && <PropCardRequest proposal={proposal} />}
        {isOffering && <PropCardOffer proposal={proposal} />}
        {customTransferUI && (
          <CustomTransfer
            proposal={proposal}
            customTransferUI={customTransferUI}
          />
        )}
      </Box>
      <DetailsLink proposalId={proposal.proposalId} />
    </Flex>
  );
};

const PropCardRequest = ({ proposal }) => {
  const requestText = useMemo(() => {
    if (proposal) {
      return generateRequestText(proposal);
    }
  }, [proposal]);
  return (
    <PropCardTransfer incoming action='Requesting' itemText={requestText} />
  );
};

const PropCardOffer = ({ proposal }) => {
  const requestText = useMemo(() => {
    if (proposal) {
      return generateOfferText(proposal);
    }
  }, [proposal]);
  return <PropCardTransfer outgoing action='Offering' itemText={requestText} />;
};

const MinionTransfer = ({ proposal, isLoaded }) => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const minionActionData = useMinionAction({
    minionAddress: proposal?.minionAddress,
  });

  if (proposal.proposalType === PROPOSAL_TYPES.PAYROLL) {
    console.log(`proposal`, proposal);
  }
  return <AsyncCardTransfer isLoaded={isLoaded} proposal={proposal} />;
};

const CustomTransfer = ({ proposal, customTransferUI }) => {
  console.log(`customTransferUI`, customTransferUI);
  if (customTransferUI === 'minionTransfer') {
    console.log('fired');
    return <MinionTransfer proposal={proposal} />;
  }
  return null;
};

const AsyncCardTransfer = props => {
  const { isLoaded } = props;
  return (
    <Skeleton isLoaded={isLoaded} height='1.5rem'>
      <PropCardTransfer /> ;
    </Skeleton>
  );
};

const PropCardTransfer = ({
  incoming,
  outgoing,
  itemText,
  action,
  specialLocation,
}) => {
  return (
    <Flex alignItems='center' mb='2'>
      {incoming && (
        <Box transform='translateY(1px)'>
          <RiArrowRightLine size='1.1rem' />
        </Box>
      )}
      {outgoing && (
        <Box transform='translateY(1px)'>
          <RiArrowLeftLine size='1.1rem' />
        </Box>
      )}
      {specialLocation ? (
        <ParaMd ml='1'>
          {action}
          <Bold> {itemText} </Bold> to <Bold> {specialLocation}</Bold>
        </ParaMd>
      ) : (
        <ParaMd ml='1'>
          {action}
          <Bold> {itemText} </Bold>
        </ParaMd>
      )}
    </Flex>
  );
};

export default ProposalCardV2;
