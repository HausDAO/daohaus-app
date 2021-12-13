import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { ParaSm } from '../components/typography';
import { validate } from '../utils/validation';
import { useTX } from '../contexts/TXContext';
import { TX } from '../data/contractTX';
import {
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  UserVoteData,
  VotingActive,
  VotingInactive,
} from './actionPrimitives';

const VotingPeriod = ({ proposal, voteData }) => {
  const [isLoading, setLoading] = useState(false);
  const { submitTransaction } = useTX();
  const getTime = () => {
    if (validate.number(Number(proposal?.votingPeriodStarts))) {
      return formatDistanceToNow(
        new Date(Number(proposal?.votingPeriodEnds) * 1000),
        {
          addSuffix: true,
        },
      );
    }
    return '--';
  };

  const voteYes = async () => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalIndex, 1],
      tx: TX.SUBMIT_VOTE,
    });
    setLoading(false);
  };

  const voteNo = async () => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalIndex, 2],
      tx: TX.SUBMIT_VOTE,
    });
    setLoading(false);
  };

  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color={voteData.isPassing ? 'green' : 'red'} />
        <ParaSm fontWeight='700' mr='1'>
          Voting
        </ParaSm>
        <ParaSm fontStyle='italic'>ends {getTime()}</ParaSm>
      </StatusDisplayBox>
      {voteData.hasVoted ? (
        <>
          <VotingInactive voteData={voteData} />
          <UserVoteData voteData={voteData} />
        </>
      ) : (
        <>
          <VotingActive
            voteYes={voteYes}
            voteNo={voteNo}
            loadingAll={isLoading}
            proposal={proposal}
            voteData={voteData}
          />
          <Flex alignItems='center' minHeight='2rem' mt={2}>
            <ParaSm fontStyle='italic'> Vote if you&apos;re a member</ParaSm>
          </Flex>
        </>
      )}
    </PropActionBox>
  );
};
export default VotingPeriod;
