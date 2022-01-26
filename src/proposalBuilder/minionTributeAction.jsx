import React, { useMemo, useState } from 'react';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';

import { TX } from '../data/contractTX';
import { useTX } from '../contexts/TXContext';
import useCanInteract from '../hooks/useCanInteract';
import { ParaSm } from '../components/typography';

const MinionTributeAction = ({ proposal }) => {
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain'],
  });
  const [loading, setLoading] = useState();
  const { submitTransaction } = useTX();

  const withdrawEscrowTokens = async () => {
    setLoading(true);
    await submitTransaction({
      tx: TX.WITHDRAW_ESCROW,
      args: [proposal.proposalId, proposal.molochAddress, [0]],
    });
    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Flex alignItems='center' flexDir='row'>
      {!proposal.executed ? (
        <Button
          onClick={withdrawEscrowTokens}
          size='sm'
          isLoading={loading}
          disabled={!canInteract}
        >
          Withdraw from Escrow
        </Button>
      ) : (
        <ParaSm>Tokens Withdrawn</ParaSm>
      )}
    </Flex>
  );
};

export default MinionTributeAction;
