import React from 'react';

import ExecuteAction from './executeAction';
import { TX } from '../data/txLegos/contractTX';

const ExecuteSafeMinion = props => {
  const { proposal } = props;

  return (
    <ExecuteAction
      {...props}
      executeTX={TX.MINION_SAFE_EXECUTE}
      argsOverride={[proposal?.proposalId, proposal?.actions[0]?.data]}
    />
  );
};

export default ExecuteSafeMinion;
