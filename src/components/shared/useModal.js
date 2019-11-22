import { useState, useContext } from 'react';
import { ModalContext } from '../../contexts/Store';

const useModal = () => {
  const [hasOpened, setHasOpened] = useContext(ModalContext);

  const [isShowing, setIsShowing] = useState({
    depositForm: false,
    depositFormInitial: false,
    rageForm: false,
    deviceNotConnectedModal: false,
    addDeviceModa: false,
    newDeviceDetectedModal: false,
    getQrCode: false,
    changePassword: false,
    daohaus: false,
  });

  function toggle(modalName) {
    setIsShowing({
      ...isShowing,
      ...{ [modalName]: !isShowing[modalName] },
    });
  }

  function open(modalName) {
    const closeModals = {};
    for (const modal in isShowing) {
      closeModals[modal] = false;
    }

    setIsShowing({
      ...closeModals,
      ...{ [modalName]: true },
    });
  }

  function openOnce(modalName) {
    const closeModals = {};

    if (!hasOpened[modalName]) {
      setHasOpened({
        ...hasOpened,
        ...{ [modalName]: true },
      });
      for (const modal in isShowing) {
        closeModals[modal] = false;
      }
      setIsShowing({
        ...closeModals,
        ...{ [modalName]: true },
      });
    }
  }

  return {
    isShowing,
    toggle,
    open,
    openOnce,
  };
};

export default useModal;
