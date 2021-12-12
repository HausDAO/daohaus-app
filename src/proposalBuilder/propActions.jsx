import React from 'react';
import VotingPeriod from './votingPeriod';
import InQueue from './inQueue';
import Unsponsored from './Unsponsored';

// export const ProposalStatus = {
//   Unknown: 'Unknown',
//   InQueue: 'InQueue',
//   VotingPeriod: 'VotingPeriod',
//   GracePeriod: 'GracePeriod',
//   Cancelled: 'Cancelled',
//   Passed: 'Passed',
//   Failed: 'Failed',
//   ReadyForProcessing: 'ReadyForProcessing',
//   Unsponsored: 'Unsponsored',
// };

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
  if (status === 'InQueue') {
    return <InQueue {...props} />;
  }
  if (status === 'GracePeriod') {
    return 'Grace Period';
  }
  if (status === 'ReadyForProcessing') {
    return 'Ready For Processing';
  }
  // If passed and is Minion
  if (status === 'Passed') {
    return 'Passed';
  }
  if (status === 'Failed') {
    return 'Failed';
  }

  return null;
};

export default PropActions;
