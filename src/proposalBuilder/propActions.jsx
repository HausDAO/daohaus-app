import React from 'react';
import { InQueue, VotingPeriod } from './actionPrimitives';
import { Unsponsored } from './Unsponsored';

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
  return null;
};

export default PropActions;
