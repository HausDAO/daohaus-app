import React from 'react';
import { Box, Button, Flex, Progress, useTheme } from '@chakra-ui/react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import { BiTachometer } from 'react-icons/bi';
import { ParaSm } from '../components/typography';
import { validate } from '../utils/validation';

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
  <Flex alignItems='center' mb={3} position='relative'>
    {children}
  </Flex>
);

export const UserVoteData = ({ voteData = {} }) => {
  const { userNo, userNoReadable, userYes, userYesReadable } = voteData;
  return (
    <>
      {(userNo || userYes) && (
        <Flex alignItems='center' minHeight='2rem'>
          <ParaSm fontStyle='italic'>
            you voted {userNo > 0 && `No ${userNoReadable}`}
            {userYes > 0 && `Yes ${userYesReadable}`}
          </ParaSm>
        </Flex>
      )}
    </>
  );
};

export const VotingBar = ({ voteData = {} }) => {
  const { totalVotes, totalYes } = voteData;
  const barPercentage =
    totalVotes && totalYes && ((totalYes / totalVotes) * 100).toFixed();

  return (
    <Progress
      value={barPercentage || 0}
      mb='3'
      size='sm'
      colorScheme='chakraProgressBarHack'
    />
  );
};

export const VotingActive = ({
  voteYes,
  voteNo,
  disableAll,
  loadingAll,
  voteData,
}) => (
  <>
    <VotingBar voteData={voteData} />
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

export const EarlyExecuteButton = () => {
  return <Button size='sm'>Early Execute</Button>;
};
export const EarlyExecuteGauge = ({ proposal, voteData }) => {
  const { totalVotes, totalYes } = voteData;
  const theme = useTheme();
  const percYesVotes =
    totalVotes && totalYes && ((totalYes / totalVotes) * 100).toFixed();
  if (validate.number(proposal?.minion?.minQuorum)) {
    return (
      <Flex position='absolute' right='0' alignItems='center'>
        <BiTachometer color={theme?.colors?.secondary?.[500]} size='1.2rem' />
        <ParaSm ml={1}>
          {percYesVotes}/{proposal.minion.minQuorum}%
        </ParaSm>
      </Flex>
    );
  }
  return null;
};
