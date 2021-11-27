import React from 'react';
import { VotingPeriod } from './actionPrimitives';
import { Unsponsored } from './Unsponsored';

const PropActions = props => {
  if (!props?.proposal?.status) return;
  const {
    proposal: { status },
  } = props;
  if (status === 'Unsponsored') {
    return <Unsponsored {...props} />;
  }
  if (status === 'VotingPeriod') {
    return <VotingPeriod {...props} />;
  }
  return null;
};

export default PropActions;
