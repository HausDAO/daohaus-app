import React, { useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useParams } from 'react-router-dom';
import { fetchBankValues } from '../utils/theGraph';

const Chart = () => {
  const { daochain, daoid } = useParams();
  const [daoBalances, setDaoBalances] = useSessionStorage(
    `balances-${daoid}`,
    null,
  );

  useEffect(() => {
    const fetchBalances = async () => {
      const data = await fetchBankValues({
        daoID: daoid,
        chainID: daochain,
      });
      setDaoBalances(data);
    };
    if (!daoBalances && daochain && daoid) {
      fetchBalances();
    }
  }, [daoBalances, setDaoBalances, daochain, daoid]);

  return (
    <div>
      <h3>Chart</h3>
      {daoBalances ? `Loaded ${daoBalances?.length} items` : 'Loading...'}
    </div>
  );
};

export default Chart;
