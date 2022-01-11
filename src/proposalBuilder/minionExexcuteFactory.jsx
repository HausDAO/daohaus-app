import React from 'react';
import { TX } from '../data/contractTX';
import { CUSTOM_CARD_DATA } from '../data/proposalData';
import ExecuteAction from './ExecuteAction';
import ExecuteRarible from './ExecuteRarible';
import UberStakingAction from './uberStakingAction';

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
  return <ExecuteAction {...props} />;
};

export default MinionExexcuteFactory;
