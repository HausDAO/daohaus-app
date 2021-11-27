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

const getCurrentStage = props => {
  console.log(`props?.proposal`, props?.proposal);
  const CurrentComponent = () => Actions?.[props?.proposal?.status];
  return <CurrentComponent {...props} />;
};

const PropActions = props => {
  if (!props?.proposal) return;
  return getCurrentStage(props);
};

export default PropActions;
