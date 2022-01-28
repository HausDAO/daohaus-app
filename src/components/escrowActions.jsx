import React, { useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';

import { useTX } from '../contexts/TXContext';
import { TX } from '../data/txLegos/contractTX';

const EscrowActions = ({ proposal }) => {
  const { molochAddress, proposalId } = proposal;
  const [loading, setLoading] = useState();
  const { submitTransaction } = useTX();

  const withdrawEscrowTokens = async () => {
    setLoading(true);
    await submitTransaction({
      tx: TX.WITHDRAW_ESCROW,
      args: [proposalId, molochAddress, [0]],
    });
    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Flex alignItems='center' flexDir='row'>
      {!proposal.executed ? (
        <Button onClick={withdrawEscrowTokens}>Withdraw from Escrow</Button>
      ) : (
        <Text>Tokens Withdrawn</Text>
      )}
    </Flex>
  );
};

export default EscrowActions;
