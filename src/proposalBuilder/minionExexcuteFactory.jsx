import React from 'react';

import ExecuteAction from './executeAction';
import ExecuteRarible from './executeRarible';
import ExecuteSafeMinion from './executeSafeMinion';
import UberStakingAction from './uberStakingAction';
import { TX } from '../data/contractTX';
import { CUSTOM_CARD_DATA } from '../data/proposalData';

const MinionExexcuteFactory = props => {
  const { proposal } = props;

  const { proposalType } = proposal;
  const executeType = CUSTOM_CARD_DATA[proposalType]?.execute;
  if (!executeType) {
    console.log(props);
  }
  if (executeType === 'executeAction') {
    return <ExecuteAction {...props} />;
  }
  if (executeType === 'UH_delegate') {
    return (
      <ExecuteAction
        {...props}
        executeTX={TX.UBERHAUS_MINION_EXECUTE_APPOINTMENT}
      />
    );
  }
  if (executeType === 'UH_staking') {
    return <UberStakingAction {...props} />;
  }
  if (executeType === 'rarible') {
    return <ExecuteRarible {...props} />;
  }
  if (executeType === 'safeMinionAction') {
    return <ExecuteSafeMinion {...props} />;
  }
  return <ExecuteAction {...props} />;
};

export default MinionExexcuteFactory;
