import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { useTX } from '../contexts/TXContext';
import { InactiveButton } from './actionPrimitives';

const ExecuteAction = ({ proposal, executeTX, minionAction, executed }) => {
  const { submitTransaction } = useTX();
  const [loading, setLoading] = useState(false);

  const execute = async () => {
    setLoading(true);
    const { minionAddress, proposalId, proposalType } = proposal;
    await submitTransaction({
      tx: executeTX,
      args: [proposal.proposalId],
      localValues: {
        minionAddress,
        proposalId,
        proposalType,
      },
    });
    setLoading(false);
  };
  console.log(`proposal`, proposal);
  if (proposal.executed) {
    return (
      <InactiveButton size='sm' leftIcon={<AiOutlineCheck />}>
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
