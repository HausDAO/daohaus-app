import React from 'react';

import ExecuteAction from './executeAction';
import ExecuteRarible from './executeRarible';
import ExecuteSafeMinion from './executeSafeMinion';
import { CUSTOM_CARD_DATA } from '../data/proposalData';
import ExecuteMinionBuyout from './executeMinionBuyout';
import MinionTributeAction from './minionTributeAction';
import { MINION_TYPES } from '../utils/proposalUtils';

const MinionExexcuteFactory = props => {
  const { proposal } = props;

  const { proposalType } = proposal;
  const executeType = CUSTOM_CARD_DATA[proposalType]?.execute;

  if (executeType === 'executeAction') {
    return <ExecuteAction {...props} />;
  }
  if (executeType === 'raribleAction') {
    return <ExecuteRarible {...props} />;
  }
  if (executeType === 'safeMinionAction') {
    return <ExecuteSafeMinion {...props} />;
  }
  if (executeType === 'minionBuyoutAction') {
    return <ExecuteMinionBuyout {...props} />;
  }
  if (executeType === 'minionTributeAction') {
    return <MinionTributeAction {...props} />;
  }
  if (proposal.minion?.minionType === MINION_TYPES.SAFE) {
    return <ExecuteSafeMinion {...props} />;
  }
  return <ExecuteAction {...props} />;
};

export default MinionExexcuteFactory;
