import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import { ParaSm } from '../components/typography';
import {
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  UserVoteData,
  VotingInactive,
} from './actionPrimitives';
import { validate } from '../utils/validation';
import ExecuteQuorum from './ExecuteQuorum';

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
      <StatusDisplayBox>
        <ExecuteQuorum proposal={proposal} voteData={voteData} />
        <StatusCircle color={voteData.isPassing ? 'green' : 'red'} />
        <ParaSm fontWeight='700' mr='1'>
          Grace Period
        </ParaSm>
        <ParaSm fontStyle='italic'>ends {getTime()}</ParaSm>
      </StatusDisplayBox>
      <VotingInactive voteData={voteData} />
      {voteData.hasVoted && <UserVoteData voteData={voteData} />}
    </PropActionBox>
  );
};
export default GracePeriod;
