import React, { useState } from 'react';
import { Button, Spinner } from '@chakra-ui/core';

import { useDao, useTxProcessor, useUser } from '../../contexts/PokemolContext';

const Withdraw = ({ tokenBalance, setOptimisticWithdraw }) => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();

  const txCallBack = (txHash, details) => {
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false, false);
      txProcessor.forceCheckTx = true;
      updateTxProcessor({ ...txProcessor });
      setLoading(false);
      setOptimisticWithdraw(true);
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);

    try {
      dao.daoService.moloch.withdrawBalance(
        tokenBalance.token.tokenAddress,
        tokenBalance.tokenBalance,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Button onClick={handleWithdraw}>Withdraw</Button>
      )}
    </>
  );
};

export default Withdraw;
