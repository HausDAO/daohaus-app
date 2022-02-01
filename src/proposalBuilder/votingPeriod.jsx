import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { useTX } from '../contexts/TXContext';
import { ParaSm } from '../components/typography';
import {
  MiddleActionBox,
  PropActionBox,
  TopStatusBox,
  UserVoteData,
  VotingActive,
  VotingInactive,
} from './proposalActionPrimitives';

import { validate } from '../utils/validation';
import { TX } from '../data/txLegos/contractTX';

const VotingPeriod = ({ proposal, voteData, canInteract, isMember }) => {
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
      <TopStatusBox
        status='Voting'
        appendStatusText={`ends ${getTime()}`}
        circleColor={voteData.isPassing ? 'green' : 'red'}
        proposal={proposal}
        voteData={voteData}
        quorum
      />
      {voteData.hasVoted ? (
        <>
          <MiddleActionBox>
            <VotingInactive voteData={voteData} />
          </MiddleActionBox>
          <UserVoteData voteData={voteData} />
        </>
      ) : (
        <>
          <MiddleActionBox>
            <VotingActive
              voteYes={voteYes}
              voteNo={voteNo}
              loadingAll={isLoading}
              disableAll={!canInteract || !isMember}
              proposal={proposal}
              voteData={voteData}
            />
          </MiddleActionBox>
          <ParaSm fontStyle='italic'> Vote if you&apos;re a member</ParaSm>
        </>
      )}
    </PropActionBox>
  );
};
export default VotingPeriod;
