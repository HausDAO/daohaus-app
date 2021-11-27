import React from 'react';
import { Unsponsored, VotingPeriod } from './proposalActionStates';

const Actions = {
  // Unknown: <,
  // InQueue: 'InQueue',
  VotingPeriod: <VotingPeriod />,
  Unsponsored: <Unsponsored />,
  // GracePeriod: 'GracePeriod',
  // Cancelled: 'Cancelled',
  // Passed: 'Passed',
  // Failed: 'Failed',
  // ReadyForProcessing: 'ReadyForProcessing',
};

const getCurrentStage = ({ proposal }) => {
  const CurrentComponent = () =>
    Actions?.[proposal?.proposalStatus] || <Unsponsored {...proposal} />;
  return <CurrentComponent {...proposal} />;
};

const PropActions = ({ proposal }) => {
  console.log(`proposal`, proposal);
  if (!proposal) return;
  return getCurrentStage(proposal);
};

export default PropActions;
