import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { DaoServiceContext } from '../../contexts/Store';
import Loading from '../shared/Loading';

const SyncTokenDiv = styled.div`
  z-index: 1000;
}`;

const SyncToken = ({ token }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [loading, setLoading] = useState(false);

  const diff = token.contractTokenBalance - token.contractBabeBalance;

  parseFloat(token.tokenBalance / 10 ** +token.decimals).toFixed(4);

  const syncToken = async () => {
    console.log('syncing', token);
    setLoading(true);
    try {
      await daoService.mcDao.collectTokens(token.token.tokenAddress);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <SyncTokenDiv>
      {loading ? (
        <Loading />
      ) : (
        <>
          <p>
            Balance is {parseFloat(diff / 10 ** +token.decimals).toFixed(4)}{' '}
            less than the Guildbank balance. Funds might have been sent directly
            to the Guildbank.
          </p>
          <button onClick={() => syncToken()}>Sync</button>
        </>
      )}
    </SyncTokenDiv>
  );
};

export default SyncToken;
