import React from 'react';
import { TX } from '../data/contractTX';
import ExecuteAction from './ExecuteAction';

const ExecuteSafeMinion = props => {
  const { proposal } = props;

  return (
    <ExecuteAction
      {...props}
      executeTX={TX.MINION_SAFE_EXECUTE}
      argsOverride={[proposal.proposalId, proposal.actions[0].data]}
    />
  );
};

export default ExecuteSafeMinion;
