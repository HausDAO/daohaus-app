import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

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
