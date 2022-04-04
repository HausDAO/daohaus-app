import React from 'react';
import { Box, Button, Flex, Progress } from '@chakra-ui/react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import { ParaSm } from '../components/typography';
import ExecuteQuorum from './executeQuorum';

export const StatusCircle = ({ color }) => (
  <Box borderRadius='50%' background={color} h='.6rem' w='.6rem' mr='2' />
);
export const VoteButton = props => {
  const { voteslabel, votes } = props;
  if (votes === 'yes') {
    return (
      <Button size='sm' minW='4rem' {...props}>
        {`Yes ${voteslabel}`}
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
        {`No ${voteslabel}`}
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
  <Flex alignItems='center' position='relative'>
    {children}
  </Flex>
);

export const TopStatusBox = ({
  status,
  proposal,
  voteData,
  helperText,
  circleColor,
  quorum,
  appendStatusText,
}) => {
  return (
    <Box mb='4'>
      <Flex
        alignItems='center'
        justifyContent='space-between'
        mb={3}
        height='1.2rem'
      >
        <StatusDisplayBox>
          <StatusCircle color={circleColor} />
          <ParaSm fontWeight='700' mr='1'>
            {status}
          </ParaSm>
          {appendStatusText && (
            <ParaSm fontStyle='italic'>{appendStatusText}</ParaSm>
          )}
        </StatusDisplayBox>
        {quorum && <ExecuteQuorum proposal={proposal} voteData={voteData} />}
      </Flex>
      {helperText && <ParaSm>{helperText}</ParaSm>}
    </Box>
  );
};

export const MiddleActionBox = ({ children }) => <Box mb={4}>{children}</Box>;

export const UserVoteData = ({ voteData = {} }) => {
  const { userNo, userNoReadable, userYes, userYesReadable } = voteData;
  return (
    <>
      {(userNo || userYes) && (
        <Flex alignItems='center' minHeight='2rem'>
          <ParaSm fontStyle='italic'>
            You voted {userNo > 0 && `No ${userNoReadable}`}
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
      mb='4'
      mt='4'
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
        voteslabel={voteData.totalNoReadable}
      />
      <VoteButton
        votes='yes'
        onClick={voteYes}
        isDisabled={disableAll}
        isLoading={loadingAll}
        voteslabel={voteData.totalYesReadable}
      />
    </Flex>
  </>
);

export const VotingInactive = props => {
  const { voteData } = props;
  const { totalYesReadable, totalNoReadable, isPassing, isFailing } = voteData;

  return (
    <>
      <VotingBar voteData={voteData} />
      <Flex justifyContent='space-between'>
        <InactiveButton
          leftIcon={isFailing && <AiOutlineClose />}
          shade={isFailing ? 'highlight' : undefined} // chakra wants this
        >
          No {totalNoReadable}
        </InactiveButton>
        <InactiveButton
          leftIcon={isPassing && <AiOutlineCheck />}
          shade={isPassing ? 'highlight' : undefined} // chakra wants this
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
