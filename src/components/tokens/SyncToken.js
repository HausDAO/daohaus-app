import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import {
  DaoServiceContext,
  CurrentWalletContext,
  CurrentUserContext,
} from '../../contexts/Store';
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
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useState(false);

  const { isShowing, toggle } = useModal();

  const txCallBack = (txHash, name) => {
    if (currentUser?.txProcessor) {
      currentUser.txProcessor.setTx(
        txHash,
        currentUser.username,
        name,
        true,
        false,
      );
      currentUser.txProcessor.pendingCount += 1;
      setCurrentUser({ ...currentUser });
    }
  };

  const syncToken = async () => {
    setLoading(true);
    try {
      console.log('token address', token.token.tokenAddress);

      await daoService.mcDao.collectTokens(
        token.token.tokenAddress,
        txCallBack,
      );
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
              <button className="TinyButton" onClick={() => toggle('syncForm')}>
                !
              </button>
              <Modal
                isShowing={isShowing.syncForm}
                hide={() => toggle('syncForm')}
              >
                <p>
                  The balance of this token is{' '}
                  {parseFloat(diff / 10 ** +token.token.decimals).toFixed(4)}{' '}
                  less than the on-chain balance. Funds might have been sent
                  directly to the DAO. Sync to update the balance.
                </p>
                {token.tokenBalance > 0 ? (
                  <button onClick={() => syncToken()}>Sync</button>
                ) : (
                  <p>
                    The sync will only work if the token balance is more than 0.
                    You will need to add to that through a tribute proposal.
                  </p>
                )}
              </Modal>
            </>
          ) : null}
        </>
      )}
    </SyncTokenDiv>
  );
};

export default SyncToken;
