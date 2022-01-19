import React from 'react';
import ExecuteAction from './ExecuteAction';

const ExecuteSafeMinion = props => {
  const { proposal } = props;
  console.log('props', props);

  return (
    <ExecuteAction
      {...props}
      argsOverride={[proposal.proposalId, proposal.actions[0].data]}
    />
  );
};

export default ExecuteSafeMinion;
