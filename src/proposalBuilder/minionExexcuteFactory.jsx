import React from 'react';
import { CUSTOM_CARD_DATA } from '../data/proposalData';
import ExecuteAction from './ExecuteAction';
import ExecuteRarible from './ExecuteRarible';
import UberDelegateAction from './uberDelegateAction';
import UberStakingAction from './uberStakingAction';

const MinionExexcuteFactory = props => {
  const { proposal } = props;
  const { proposalType } = proposal;
  const executeType = CUSTOM_CARD_DATA[proposalType].execute;
  if (executeType === 'executeAction') {
    return <ExecuteAction {...props} />;
  }
  if (executeType === 'UH_delegate') {
    return <UberDelegateAction {...proposal} />;
  }
  if (executeType === 'UH_staking') {
    return <UberStakingAction {...proposal} />;
  }
  if (executeType === 'rarible') {
    return <ExecuteRarible {...proposal} />;
  }
};

export default MinionExexcuteFactory;
