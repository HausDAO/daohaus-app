import React, { useContext, useEffect, useState } from 'react';

import {
  CurrentUserContext,
  LoaderContext,
  DaoServiceContext,
} from '../../contexts/Store';
import useModal from '../shared/useModal';
import Modal from '../shared/Modal';
import Loading from '../shared/Loading';
import UserBalance from './UserBalances';
import WithdrawEthForm from './WithdrawEthForm';
import WithdrawForm from './WithdrawForm';
// import WrapEth from './WrapEth';
import ApproveAllowance from './ApproveAllowance';
import DepositForm from './DepositForm';
import StateModals from '../shared/StateModals';
import { USER_TYPE } from '../../utils/DaoService';
import RagequitForm from './RagequitForm';
import ChangeDelegateKeyForm from './ChangeDelegateKeyForm';

import config from '../../config';

import styled from 'styled-components';
import { RiskyBizButton } from '../../App.styles';
import { phone } from '../../variables.styles';

export const UserWalletDiv = styled.div`
  position: relative;
  @media (min-width: ${phone}) {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const UserWallet = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoServiceContext);
  const [loading] = useContext(LoaderContext);
  const [livesDangerously, setLivesDangerously] = useState(false);
  const { isShowing, toggle } = useModal();
  const loginType = localStorage.getItem('loginType') || USER_TYPE.READ_ONLY;

  useEffect(() => {
    setLivesDangerously(JSON.parse(localStorage.getItem('walletWarning')));
  }, []);

  const handleToggle = (modal) => {
    toggle(modal);
  };

  const acceptWarning = () => {
    setLivesDangerously(true);
    localStorage.setItem('walletWarning', JSON.stringify(true));
  };

  return (
    <>
      {loading && <Loading />}
      {currentUser && (
        <UserWalletDiv>
          <StateModals />

          {!livesDangerously && loginType !== USER_TYPE.WEB3 ? (
            <RiskyBizButton onClick={() => acceptWarning()}>
              <span role="alert" aria-label="skull and crossbones">
                ☠
              </span>
              This app is experimental and should not hold large amounts of
              crypto. Use at your own risk.
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </RiskyBizButton>
          ) : null}

          <UserBalance toggle={handleToggle} />

          <Modal
            isShowing={isShowing.depositForm}
            hide={() => toggle('depositForm')}
          >
            <DepositForm className="FlexCenter" />
          </Modal>

          {/* <Modal isShowing={isShowing.wrapForm} hide={() => toggle('wrapForm')}>
            <WrapEth />
          </Modal> */}

          <Modal
            isShowing={isShowing.allowanceForm}
            hide={() => toggle('allowanceForm')}
          >
            <ApproveAllowance hide={toggle} />
          </Modal>

          <Modal isShowing={isShowing.sendEth} hide={() => toggle('sendEth')}>
            <WithdrawEthForm />
          </Modal>

          <Modal
            isShowing={isShowing.sendToken}
            hide={() => toggle('sendToken')}
          >
            <WithdrawForm />
          </Modal>

          <Modal isShowing={isShowing.ragequit} hide={() => toggle('ragequit')}>
            <RagequitForm hide={toggle} />
          </Modal>

          <Modal
            isShowing={isShowing.changeDelegateKey}
            hide={() => toggle('changeDelegateKey')}
          >
            <ChangeDelegateKeyForm hide={toggle} />
          </Modal>

          <Modal isShowing={isShowing.daohaus} hide={() => toggle('daohaus')}>
            <h3>Manage Shares</h3>
            <p>
              If you made your initial pledge on DAOHaus you you can ragequit
              shares and update your delegate key there.
            </p>
            <a
              className="Button"
              rel="noopener noreferrer"
              target="_blank"
              href={`${config.DAOHAUS_URL}/${daoService.daoAddress}`}
            >
              Continue to DAOHaus
            </a>
          </Modal>
        </UserWalletDiv>
      )}
    </>
  );
};
export default UserWallet;
