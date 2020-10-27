import React, { useEffect } from 'react';

import { TxProcessorService } from '../utils/TxProcessorService';
import { useTxProcessor, useUser, useWeb3Connect } from './PokemolContext';

const TxProcessorInit = () => {
  const [user] = useUser();
  const [web3Connect] = useWeb3Connect();
  const [, updateTxProcessor] = useTxProcessor();

  useEffect(() => {
    if (user && web3Connect.web3) {
      initTxProcessor();
    }
  }, [user, web3Connect]);

  const initTxProcessor = async () => {
    const txProcessorService = new TxProcessorService(web3Connect);
    txProcessorService.update(user.username);
    txProcessorService.forceUpdate =
      txProcessorService.getTxPendingList(user.username).length > 0;

    updateTxProcessor(txProcessorService);

    web3Connect.web3.eth.subscribe('newBlockHeaders', async (error, result) => {
      if (!error) {
        if (txProcessorService.forceUpdate) {
          await txProcessorService.update(user.username);

          if (!txProcessorService.getTxPendingList(user.username).length) {
            txProcessorService.forceUpdate = false;
          }

          updateTxProcessor(txProcessorService);
        }
      }
    });
  };

  return <></>;
};

export default TxProcessorInit;
