import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { DaoServiceContext, CurrentWalletContext } from '../../contexts/Store';
import Loading from '../shared/Loading';

import useModal from '../shared/useModal';
import Modal from '../shared/Modal';

const SyncTokenDiv = styled.div`
  z-index: 1000;
  display: inline-block;
  margin-left: 10px;
  .TinyButton {
    padding: 5px 15px;
    background-color: ${(props) => props.theme.danger};
    margin: 0px;
  }
}`;

const SyncToken = ({ token }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [loading, setLoading] = useState(false);

  const { isShowing, toggle } = useModal();

  const syncToken = async () => {
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
          <button className="TinyButton" onClick={() => toggle('syncForm')}>
            !
          </button>
          <Modal isShowing={isShowing.syncForm} hide={() => toggle('syncForm')}>
            <p>
              The balance of this token is{' '}
              {parseFloat(diff / 10 ** +token.decimals).toFixed(4)} less than
              the on-chain balance. Funds might have been sent directly to the
              DAO. Sync to update the balance.
            </p>
            {currentWallet.shares > 0 ? (
              <>
                {token.tokenBalance > 0 ? (
                  <button onClick={() => syncToken()}>Sync</button>
                ) : (
                  <p>
                    The sync will only work if the token balance is more than 0.
                    You will need to add to that through a tribute proposal.
                  </p>
                )}
              </>
            ) : null}
          </Modal>
        </>
      )}
    </SyncTokenDiv>
  );
};

export default SyncToken;
