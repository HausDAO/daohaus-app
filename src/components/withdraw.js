import React, { useState } from 'react';
import { Button, Spinner } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';

// import { useDao, useTxProcessor, useUser } from '../../contexts/PokemolContext';

const Withdraw = ({ token }) => {
  const { injectedProvider, address } = useInjectedProvider();
  const { errorToast, successToast, setTxInfoModal } = useOverlay();
  const { daoOverview } = useDao();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();
  const { daoid, daochain } = useParams();

  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    setLoading(true);

    try {
      const poll = createPoll({ action: 'withdrawBalance', cachePoll })({
        tokenAddress: token.tokenAddress,
        chainID: daochain,
        daoID: daoid,
        memberAddress: address,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
              description: error?.message || '',
            });
            resolvePoll(txHash);
            setLoading(false);
            console.error(
              `Could not find a matching proposal: ${error?.message}`,
            );
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'Withdrew Tokens!',
            });
            sessionStorage.removeItem('AllTokens');
            refreshDao();
            setLoading(false);
            resolvePoll(txHash);
          },
        },
      });
      const onTxHash = () => {
        setTxInfoModal(true);
      };
      const args = [token.tokenAddress, token.tokenBalance];
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview.version,
      })('withdrawBalance')({ args, address, poll, onTxHash });
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
      errorToast({
        title: `There was an error.`,
        description: err?.message || '',
      });
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Button size='sm' onClick={handleWithdraw}>
          Withdraw
        </Button>
      )}
    </>
  );
};

export default Withdraw;
