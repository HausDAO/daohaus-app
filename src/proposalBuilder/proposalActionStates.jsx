import React, { useMemo } from 'react';
import { Box, Button, Flex, Progress } from '@chakra-ui/react';
import { ParaSm } from '../components/typography';
import { useDao } from '../contexts/DaoContext';
import { propStatusText } from './propCardText';
import { getReadableBalance } from '../utils/tokenValue';
import { readableTokenBalance } from '../utils/proposalCard';

const StatusCircle = ({ color }) => (
  <Box borderRadius='50%' background={color} h='.6rem' w='.6rem' mr='2' />
);
const VoteButton = ({ yes, no }) => {
  if (yes) {
    return (
      <Button size='sm' minW='4rem'>
        Yes
      </Button>
    );
  }
  if (no) {
    return (
      <Button size='sm' minW='4rem' backgroundColor='white' color='black'>
        No
      </Button>
    );
  }
};

const AbstainButton = () => (
  <Button size='sm' minW='4rem' color='secondary.500' variant='outline'>
    Abstain
  </Button>
);

const PropActionBox = ({ children }) => (
  <Box px='1.2rem' py='0.6rem' w='100%'>
    {children}
  </Box>
);

const StatusDisplayBox = ({ children }) => (
  <Flex alignItems='center' mb={3}>
    {children}
  </Flex>
);

const VotingSection = () => (
  <Flex justifyContent='space-between'>
    <VoteButton no />
    <AbstainButton />
    <VoteButton yes />
  </Flex>
);

export const Unsponsored = () => {
  const { daoOverview } = useDao();
  const deposit = useMemo(() => {
    const { depositToken, proposalDeposit } = daoOverview || {};
    if (!depositToken?.decimals || !depositToken.symbol || !proposalDeposit)
      return;
    console.log(depositToken);
    return readableTokenBalance({
      balance: proposalDeposit,
      decimals: depositToken?.decimals,
      symbol: depositToken?.symbol,
    });
  }, [daoOverview]);
  console.log(`deposit`, deposit);
  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color='green' />
        <ParaSm fontWeight='700' mr='1'>
          Unsponsored
        </ParaSm>
      </StatusDisplayBox>
      <ParaSm mb={3}>{propStatusText.Unsponsored}</ParaSm>
      <Button size='sm' minW='4rem' fontWeight='700'>
        Sponsor {deposit && `(${deposit})`}
      </Button>
    </PropActionBox>
  );
};

export const VotingPeriod = () => {
  <PropActionBox>
    <StatusDisplayBox>
      <StatusCircle color='green' />
      <ParaSm fontWeight='700' mr='1'>
        Passed
      </ParaSm>
      <ParaSm>and needs execution </ParaSm>
    </StatusDisplayBox>
    <Progress value={80} mb='3' colorScheme='secondary.500' />
    <VotingSection />
  </PropActionBox>;
};
