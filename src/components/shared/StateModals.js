import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';

import './StateModals.scss';
import useModal from './useModal';

import Modal from './Modal';
import DepositFormInitial from '../account/DepositFormInitial';
import { WalletStatuses } from '../../utils/WalletStatus';
import Deploy from '../account/Deploy';
import DepositForm from '../account/DepositForm';

const StateModals = (props) => {
  const { location } = props;
  
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  // Toggle functions
  const { isShowing, toggle, openOnce } = useModal();

  useEffect(() => {
    if (!currentUser) {
      return () => false;
    } else {
      (async () => {
        const status = currentWallet.status;

        switch (status) {
          case WalletStatuses.UnDeployed:
            if(location.pathname !== '/account') {
              openOnce('connectedUndeployed');
            }
            break;
          case WalletStatuses.LowGasForDeploy:
            if(location.pathname !== '/account') {
              openOnce('depositFormInitial');
            }
            break;
          default:
            break;
        }
      })();
    }
    // eslint-disable-next-line
  }, [currentWallet]);

  return (
    <>
      <Modal
        isShowing={isShowing.depositFormInitial}
        hide={() => toggle('depositFormInitial')}
      >
        <DepositFormInitial className="FlexCenter" />
      </Modal>
      <Modal
        isShowing={isShowing.depositForm}
        hide={() => toggle('depositForm')}
      >
        <DepositForm className="FlexCenter" />
      </Modal>
      <Modal
        isShowing={isShowing.connectedUndeployed}
        hide={() => toggle('connectedUndeployed')}
      >
        <h3><span role="img" aria-label="party popper">🎉</span> Congrats! <span role="img" aria-label="party popper">🎉</span></h3>
        <h2>Your account is ready to deploy.</h2>
        <Deploy />
      </Modal>
    </>
  );
};
export default withRouter(StateModals);
