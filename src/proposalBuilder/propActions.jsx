import React from 'react';
import VotingPeriod from './votingPeriod';
import InQueue from './inQueue';
import Unsponsored from './Unsponsored';
import ReadyForProcessing from './readyForProcessing';
import GracePeriod from './gracePeriod';
import { ProposalStatus } from '../utils/proposalUtils';
import Processed from './processed';

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
  if (status === ProposalStatus.Unsponsored) {
    return <Unsponsored {...props} />;
  }
  if (status === ProposalStatus.Cancelled) {
    return 'Cancelled';
  }
  if (status === ProposalStatus.VotingPeriod) {
    return <VotingPeriod {...props} />;
  }
  if (status === ProposalStatus.InQueue) {
    return <InQueue {...props} />;
  }
  if (status === ProposalStatus.GracePeriod) {
    return <GracePeriod {...props} />;
  }
  if (status === ProposalStatus.ReadyForProcessing) {
    return <ReadyForProcessing {...props} />;
  }

  if (
    status === ProposalStatus.Passed ||
    status === ProposalStatus.Failed ||
    status === ProposalStatus.NeedsExecution
  ) {
    return <Processed {...props} />;
  }
  if (status === 'Failed') {
    return 'Failed';
  }

  return null;
};

export default PropActions;
