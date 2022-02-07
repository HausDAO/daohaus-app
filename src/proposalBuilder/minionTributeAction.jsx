import React, { useState } from 'react';
import { Button, Flex, Spinner } from '@chakra-ui/react';

import { TX } from '../data/txLegos/contractTX';
import { useTX } from '../contexts/TXContext';
import { ParaSm } from '../components/typography';

const MinionTributeAction = ({ proposal, canInteract }) => {
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
