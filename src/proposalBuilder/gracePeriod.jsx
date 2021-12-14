import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import { ParaSm } from '../components/typography';
import {
  EarlyExecuteGauge,
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  UserVoteData,
  VotingInactive,
} from './actionPrimitives';
import { validate } from '../utils/validation';

const GracePeriod = ({ proposal, voteData }) => {
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

  return (
    <PropActionBox>
      <StatusDisplayBox>
        <EarlyExecuteGauge proposal={proposal} voteData={voteData} />
        <StatusCircle color={voteData.isPassing ? 'green' : 'red'} />
        <ParaSm fontWeight='700' mr='1'>
          Grace Periods
        </ParaSm>
        <ParaSm fontStyle='italic'>ends {getTime()}</ParaSm>
      </StatusDisplayBox>
      <VotingInactive voteData={voteData} />
      {voteData.hasVoted && <UserVoteData voteData={voteData} />}
    </PropActionBox>
  );
};
export default GracePeriod;
