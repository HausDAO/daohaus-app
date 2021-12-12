import React from 'react';
import { Box, Button, Flex, Progress } from '@chakra-ui/react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

export const StatusCircle = ({ color }) => (
  <Box borderRadius='50%' background={color} h='.6rem' w='.6rem' mr='2' />
);
export const VoteButton = props => {
  const { votes } = props;
  if (votes === 'yes') {
    return (
      <Button size='sm' minW='4rem' {...props}>
        Yes
      </Button>
    );
  }
  if (votes === 'no') {
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
  return null;
};

export const InactiveButton = props =>
  props.shade === 'highlight' ? (
    <Button
      size='sm'
      minW='4rem'
      variant='outline'
      cursor='not-allowed'
      disabled
      _disabled={{
        color: 'whiteAlpha.800',
        borderColor: 'whiteAlpha.500',
      }}
      _hover={{
        color: 'whiteAlpha.900',
        borderColor: 'whiteAlpha.900',
      }}
      {...props}
    />
  ) : (
    <Button
      size='sm'
      minW='4rem'
      variant='outline'
      cursor='not-allowed'
      disabled
      _disabled={{
        color: 'whiteAlpha.600',
        borderColor: 'whiteAlpha.200',
      }}
      _hover={{
        color: 'whiteAlpha.600',
        borderColor: 'whiteAlpha.600',
      }}
      {...props}
    />
  );

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

export const VotingBar = ({ voteData }) => {
  const { totalVotes, totalYes } = voteData;
  const barPercentage = ((totalYes / totalVotes) * 100).toFixed();
  return (
    <Progress
      value={barPercentage}
      mb='3'
      size='sm'
      colorScheme='chakraProgressBarHack'
    />
  );
};

export const VotingActive = ({ voteYes, voteNo, disableAll, loadingAll }) => (
  <>
    <VotingBar />
    <Flex justifyContent='space-between'>
      <VoteButton
        votes='no'
        onClick={voteNo}
        isDisabled={disableAll}
        isLoading={loadingAll}
      />
      <VoteButton
        votes='yes'
        onClick={voteYes}
        isDisabled={disableAll}
        isLoading={loadingAll}
      />
    </Flex>
  </>
);

export const VotingInactive = props => {
  const { voteData } = props;
  const { votedNo, votedYes, totalYesReadable, totalNoReadable } = voteData;

  return (
    <>
      <VotingBar voteData={voteData} />
      <Flex justifyContent='space-between'>
        <InactiveButton
          leftIcon={votedNo && <AiOutlineClose />}
          shade={votedNo ? 'highlight' : undefined} // chakra wants this
        >
          No {totalNoReadable}
        </InactiveButton>
        <InactiveButton
          leftIcon={votedYes && <AiOutlineCheck />}
          shade={votedYes ? 'highlight' : undefined} // chakra wants this
        >
          Yes {totalYesReadable}
        </InactiveButton>
      </Flex>
    </>
  );
};

export const VotingSection = props => {
  if (props.hasVoted) {
    return <VotingInactive {...props} />;
  }
  return <VotingActive {...props} />;
};
