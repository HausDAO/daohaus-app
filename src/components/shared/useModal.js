import { useState } from 'react';

const useModal = () => {

  const [isShowing, setIsShowing] = useState({
    depositForm: false,
    depositFormInitial: false,
    ragequit: false,
    deviceNotConnectedModal: false,
    addDeviceModa: false,
    newDeviceDetectedModal: false,
    getQrCode: false,
    changePassword: false,
    daohaus: false,
    changeDelegateKey: false,
    txProcessorMsg: false,
    alertMessage: false,
  });

  function toggle(modalName) {
    setIsShowing((s) => ({
      ...s,
      ...{ [modalName]: !isShowing[modalName] },
    }));
  }

  function open(modalName) {
    const closeModals = {};
    for (const modal in isShowing) {
      closeModals[modal] = false;
    }
    console.log('????', modalName);

    setIsShowing({
      ...closeModals,
      ...{ [modalName]: true },
    });
  }

  return {
    isShowing,
    toggle,
    open,
  };
};

export default useModal;
