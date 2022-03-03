import React, { useState } from 'react';
import { Button, Spinner, Tooltip } from '@chakra-ui/react';

import { useTX } from '../contexts/TXContext';
import useCanInteract from '../hooks/useCanInteract';
import { TX } from '../data/txLegos/contractTX';

const Withdraw = ({ token }) => {
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain'],
  });
  const { submitTransaction } = useTX();
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    setLoading(true);
    await submitTransaction({
      tx: TX.WITHDRAW,
      args: [token.tokenAddress, token.tokenBalance],
    });
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {canInteract ? (
            <Button size='sm' onClick={handleWithdraw}>
              Withdraw
            </Button>
          ) : (
            <Tooltip
              hasArrow
              shouldWrapChildren
              placement='bottom'
              label='Wrong network'
              bg='secondary.500'
            >
              <Button size='sm' disabled>
                Withdraw
              </Button>
            </Tooltip>
          )}
        </>
      )}
    </>
  );
};

export default Withdraw;
