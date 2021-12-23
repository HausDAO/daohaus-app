import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { useTX } from '../contexts/TXContext';
import { InactiveButton } from './actionPrimitives';

const ExecuteAction = ({ proposal, executeTX, minionAction }) => {
  const { submitTransaction } = useTX();
  const [loading, setLoading] = useState(false);

  const execute = async () => {
    setLoading(true);
    await submitTransaction({
      tx: executeTX,
      args: [proposal.proposalId],
      localValues: {
        minionAddress: proposal.minionAddress,
        proposalId: proposal.proposalId,
      },
    });
    setLoading(false);
  };
  if (minionAction.executed) {
    console.log('has been executited');
    return (
      <InactiveButton size='sm' mr='2' leftIcon={<AiOutlineCheck />}>
        Executed
      </InactiveButton>
    );
  }
  return (
    <Button onClick={execute} size='sm' isLoading={loading}>
      Execute
    </Button>
  );
};

export default ExecuteAction;
