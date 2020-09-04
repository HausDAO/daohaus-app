import React, { useContext } from 'react';
import styled from 'styled-components';

import { CurrentUserContext, LoaderContext } from '../../contexts/Store';
import useModal from '../shared/useModal';
import Modal from '../shared/Modal';
import Loading from '../shared/Loading';
import UserBalance from './UserBalances';
import ApproveAllowance from './ApproveAllowance';
import RagequitForm from './RagequitForm';
import ChangeDelegateKeyForm from './ChangeDelegateKeyForm';
import DepositForm from './DepositForm';

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
  const [loading] = useContext(LoaderContext);
  const { isShowing, toggle } = useModal();

  const handleToggle = (modal) => {
    toggle(modal);
  };

  return (
    <>
      {loading && <Loading />}
      {currentUser && (
        <UserWalletDiv>
          <UserBalance toggle={handleToggle} />

          <Modal
            isShowing={isShowing.allowanceForm}
            hide={() => toggle('allowanceForm')}
          >
            <ApproveAllowance hide={toggle} />
          </Modal>

          <Modal
            isShowing={isShowing.changeDelegateKey}
            hide={() => toggle('changeDelegateKey')}
          >
            <ChangeDelegateKeyForm hide={toggle} />
          </Modal>

          <Modal
            isShowing={isShowing.depositForm}
            hide={() => toggle('depositForm')}
          >
            <DepositForm className="FlexCenter" />
          </Modal>

          <Modal isShowing={isShowing.ragequit} hide={() => toggle('ragequit')}>
            <RagequitForm hide={toggle} />
          </Modal>
        </UserWalletDiv>
      )}
    </>
  );
};
export default UserWallet;
