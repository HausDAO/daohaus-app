import React, { useMemo } from 'react';
import { Box, Button, Flex, Progress } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { ParaSm } from '../components/typography';
import { validate } from '../utils/validation';

export const StatusCircle = ({ color }) => (
  <Box borderRadius='50%' background={color} h='.6rem' w='.6rem' mr='2' />
);
export const VoteButton = props => {
  const { yes, no } = props;
  if (yes) {
    return (
      <Button size='sm' minW='4rem' {...props}>
        Yes
      </Button>
    );
  }
  if (no) {
    return (
      <Button
        size='sm'
        minW='4rem'
        backgroundColor='white'
        color='black'
        {...props}
      >
        No
      </Button>
    );
  }
};

export const AbstainButton = props => (
  <Button
    size='sm'
    minW='4rem'
    color='secondary.500'
    variant='outline'
    {...props}
  >
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

export const VotingSection = ({
  voteYes,
  voteNo,
  abstain,
  disableAll,
  loadingAll,
}) => {
  return (
    <Flex justifyContent='space-between'>
      <VoteButton
        no
        onClick={voteNo}
        isDisabled={disableAll}
        isLoading={loadingAll}
      />
      <AbstainButton
        onClick={abstain}
        isDisabled={disableAll}
        isLoading={loadingAll}
      />
      <VoteButton
        yes
        onClick={voteYes}
        isDisabled={disableAll}
        isLoading={loadingAll}
      />
    </Flex>
  );
};

export const InQueue = ({ proposal }) => {
  const time = useMemo(() => {
    if (validate.number(Number(proposal?.votingPeriodStarts))) {
      return formatDistanceToNow(
        new Date(Number(proposal?.votingPeriodStarts) * 1000),
      );
    }
  }, [proposal]);
  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color='green' />
        <ParaSm fontWeight='700' mr='1'>
          Voting
        </ParaSm>
        <ParaSm>starts in {time} </ParaSm>
      </StatusDisplayBox>
      <Progress value={80} mb='3' colorScheme='secondary.500' />
      <VotingSection disableAll />
    </PropActionBox>
  );
};
