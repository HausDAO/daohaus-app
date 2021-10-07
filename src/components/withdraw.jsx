import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spinner, Tooltip } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import { TX } from '../data/contractTX';
import { daoConnectedAndSameChain } from '../utils/general';

const Withdraw = ({ token }) => {
  const { address, injectedChain } = useInjectedProvider();
  const { submitTransaction } = useTX();
  const { daochain } = useParams();
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
          {daoConnectedAndSameChain(
            address,
            daochain,
            injectedChain?.chainId,
          ) ? (
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
