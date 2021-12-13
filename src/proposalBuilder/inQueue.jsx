import React, { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

import {
  PropActionBox,
  StatusDisplayBox,
  StatusCircle,
  VotingInactive,
} from './actionPrimitives';
import { ParaSm } from '../components/typography';
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
      <StatusDisplayBox>
        <StatusCircle color='green' />
        <ParaSm fontWeight='700' mr='1'>
          Voting
        </ParaSm>
        <ParaSm>starts in {time} </ParaSm>
      </StatusDisplayBox>
      <VotingInactive voteData={voteData} />
    </PropActionBox>
  );
};

export default InQueue;
