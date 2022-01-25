import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { AiOutlineCheck } from 'react-icons/ai';

import { useTX } from '../contexts/TXContext';
import { InactiveButton } from './proposalActionPrimitives';
import useCanInteract from '../hooks/useCanInteract';

const ExecuteAction = ({
  proposal,
  executeTX,
  argsOverride,
  disabledOverride,
}) => {
  const { submitTransaction } = useTX();
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain'],
  });
  const [loading, setLoading] = useState(false);

  const execute = async () => {
    setLoading(true);
    const { minionAddress, proposalId, proposalType } = proposal;
    await submitTransaction({
      tx: executeTX,
      args: argsOverride || [proposal.proposalId],
      localValues: {
        minionAddress,
        proposalId,
        proposalType,
      },
    });
    setLoading(false);
  };

  if (proposal.executed) {
    return (
      <InactiveButton size='sm' leftIcon={<AiOutlineCheck />}>
        Executed
      </InactiveButton>
    );
  }

  return (
    <Button
      onClick={execute}
      size='sm'
      isLoading={loading}
      disabled={disabledOverride || !canInteract}
    >
      Execute
    </Button>
  );
};

export default ExecuteAction;
