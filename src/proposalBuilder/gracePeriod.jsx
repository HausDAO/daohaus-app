import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import {
  MiddleActionBox,
  PropActionBox,
  TopStatusBox,
  UserVoteData,
  VotingInactive,
} from './proposalActionPrimitives';
import { validate } from '../utils/validation';

const GracePeriod = ({ proposal, voteData }) => {
  const getTime = () => {
    if (validate.number(Number(proposal?.gracePeriodEnds))) {
      return formatDistanceToNow(
        new Date(Number(proposal?.gracePeriodEnds) * 1000),
        {
          addSuffix: true,
        },
      );
    }
    return '--';
  };

  return (
    <PropActionBox>
      <TopStatusBox
        status='Grace Period'
        appendStatusText={`ends ${getTime()}`}
        circleColor={voteData.isPassing ? 'green' : 'red'}
        proposal={proposal}
        voteData={voteData}
        quorum
      />
      <MiddleActionBox>
        <VotingInactive voteData={voteData} />
      </MiddleActionBox>
      {voteData.hasVoted && <UserVoteData voteData={voteData} />}
    </PropActionBox>
  );
};
export default GracePeriod;
