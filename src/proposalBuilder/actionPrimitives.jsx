import React from 'react';
import { Box, Button, Flex, Progress, useTheme } from '@chakra-ui/react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import { BiTachometer } from 'react-icons/bi';
import { ParaSm } from '../components/typography';
import { earlyExecuteMinionType, getExecuteAction } from '../utils/minionUtils';
import { MINION_TYPES } from '../utils/proposalUtils';
import { useTX } from '../contexts/TXContext';

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
  //  Awaiting early execute designs
  // const [buttonState, setButtonState] = useState('loading');

  // useEffect(() => {
  //   return () => {};
  // }, []);

  return <Button size='sm'>Early Execute</Button>;
};

export const EarlyExecuteGauge = ({ proposal, voteData }) => {
  const { totalVotes, totalYes } = voteData;
  const { submitTransaction } = useTX();

  const theme = useTheme();
  const percYesVotes =
    totalVotes && totalYes && ((totalYes / totalVotes) * 100).toFixed();
  const hasReachedQuorum = percYesVotes >= Number(proposal?.minion?.minQuorum);

  const execute = async () => {
    const { minionAddress, proposalId, proposalType, minion } = proposal;
    await submitTransaction({
      tx: getExecuteAction({ minion }),
      args:
        minion.minionType === MINION_TYPES.SAFE
          ? [proposal.proposalId, proposal.actions[0].data]
          : [proposal.proposalId],
      localValues: {
        minionAddress,
        proposalId,
        proposalType,
      },
    });
  };

  if (!proposal?.minion?.minQuorum || !earlyExecuteMinionType(proposal))
    return null;
  if (hasReachedQuorum && !proposal.executed) {
    return (
      <Flex position='absolute' right='0' alignItems='center'>
        <Button variant='ghost' size='fit-content' onClick={execute}>
          <BiTachometer color={theme?.colors?.secondary?.[500]} size='1.2rem' />
          <ParaSm ml={1}>
            {percYesVotes}/{proposal.minion.minQuorum}%
          </ParaSm>
        </Button>
      </Flex>
    );
  }

  if (!hasReachedQuorum) {
    return (
      <Flex
        position='absolute'
        right='0'
        alignItems='center'
        opacity='.6'
        cursor='not-allowed'
      >
        <BiTachometer color='white' size='1.2rem' />
        <ParaSm ml={1}>
          {percYesVotes}/{proposal.minion.minQuorum}%
        </ParaSm>
      </Flex>
    );
  }

  return null;
};
