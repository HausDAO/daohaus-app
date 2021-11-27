import React from 'react';
import { Box, Button, Flex, Progress } from '@chakra-ui/react';
import { ParaSm } from '../components/typography';

export const StatusCircle = ({ color }) => (
  <Box borderRadius='50%' background={color} h='.6rem' w='.6rem' mr='2' />
);
export const VoteButton = ({ yes, no }) => {
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

export const AbstainButton = () => (
  <Button size='sm' minW='4rem' color='secondary.500' variant='outline'>
    Abstain
  </Button>
);

export const PropActionBox = ({ children }) => (
  <Box px='1.2rem' py='0.6rem' w='100%'>
    {children}
  </Box>
);

export const StatusDisplayBox = ({ children }) => (
  <Flex alignItems='center' mb={3}>
    {children}
  </Flex>
);

export const VotingSection = () => (
  <Flex justifyContent='space-between'>
    <VoteButton no />
    <AbstainButton />
    <VoteButton yes />
  </Flex>
);

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
