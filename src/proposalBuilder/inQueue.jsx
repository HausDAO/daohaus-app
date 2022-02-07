import React, { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

import {
  PropActionBox,
  VotingInactive,
  TopStatusBox,
  MiddleActionBox,
} from './proposalActionPrimitives';
import { validate } from '../utils/validation';

const InQueue = props => {
  const { proposal, voteData } = props;
  const time = useMemo(() => {
    if (validate.number(Number(proposal?.votingPeriodStarts))) {
      return formatDistanceToNow(
        new Date(Number(proposal?.votingPeriodStarts) * 1000),
      );
    }
  }, [proposal]);

  return (
    <PropActionBox>
      <TopStatusBox
        status='Voting'
        circleColor='green'
        appendStatusText={`starts in ${time}`}
      />
      <MiddleActionBox>
        <VotingInactive voteData={voteData} />
      </MiddleActionBox>
    </PropActionBox>
  );
};

export default InQueue;
