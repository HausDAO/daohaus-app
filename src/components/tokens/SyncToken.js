import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { DaoServiceContext, CurrentWalletContext } from '../../contexts/Store';
import Loading from '../shared/Loading';

const SyncTokenDiv = styled.div`
  z-index: 1000;
}`;

const SyncToken = ({ token }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [loading, setLoading] = useState(false);

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

  const diff = token.contractTokenBalance - token.contractBabeBalance;
  return (
    <SyncTokenDiv>
      {loading ? (
        <Loading />
      ) : (
        <>
          {currentWallet.shares > 0 ? (
            <>
              <p>
                This balance is{' '}
                {parseFloat(diff / 10 ** +token.decimals).toFixed(4)} less than
                the on-chain balance. Funds might have been sent directly to the
                Guildbank.
              </p>
              <button onClick={() => syncToken()}>Sync</button>
            </>
          ) : null}
        </>
      )}
    </SyncTokenDiv>
  );
};

export default SyncToken;
