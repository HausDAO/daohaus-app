import React, { useContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

import { CurrentUserContext } from '../../contexts/Store';
import useModal from '../../components/shared/useModal';

import styled from 'styled-components';

import Modal from '../shared/Modal';
import ChangePassword from '../../auth/ChangePassword';

import { basePadding } from '../../variables.styles.js';

const AccountListDiv = styled.div`
  h5 {
    margin: 5px 0px;
  }
  padding: ${basePadding};
`;

const AccountList = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [isThisDeviceAdded, setIsThisDeviceAdded] = useState(true);
  const [, setWaitingSdk] = useState(true);
  const [, setAccountDevices] = useState([]);
  const { isShowing, toggle } = useModal();
  const [, setParsedNamedDevices] = useState({});

  useEffect(() => {
    (async () => {
      if (currentUser && currentUser.sdk) {
        try {
          setWaitingSdk(true);
          const _accountDevices = await currentUser.sdk.getConnectedAccountDevices();
          setIsThisDeviceAdded(
            _accountDevices.items.some(
              (item) =>
                item.device.address === currentUser.sdk.state.deviceAddress,
            ),
          );

          setAccountDevices(
            _accountDevices.items.filter((item) => {
              return (
                item.device.address !== currentUser.sdk.state.deviceAddress
              );
            }),
          );
          const user = await Auth.currentAuthenticatedUser();
          const userAttributes = await Auth.userAttributes(user);
          setWaitingSdk(false);
          if (
            userAttributes.find((item) => item.Name === 'custom:named_devices')
          ) {
            setParsedNamedDevices(
              JSON.parse(
                userAttributes.find(
                  (item) => item.Name === 'custom:named_devices',
                ).Value,
              ),
            );
          }
        } catch (error) {
          console.error(error);
          setWaitingSdk(false);
        }
      }
    })();
    // eslint-disable-next-line
  }, [currentUser]);

  return (
    <AccountListDiv>
      <h5>Password</h5>
      <button className="" onClick={() => toggle('changePassword')}>
        Change Password
      </button>
      <h5>Keys</h5>
      <button
        onClick={isThisDeviceAdded ? null : () => toggle('getreadQrCode')}
        className={
          isThisDeviceAdded ? 'Button--Input Verified' : 'Button--Input'
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
        {isThisDeviceAdded ? 'PP Keystore' : 'Add this device'}
        {isThisDeviceAdded ? (
          <svg
            className="AddItem"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
            <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="AddItem"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        )}
      </button>
      {/* commented out until ready 
      <button className="Button--Input Email Verified">
        Export Paper Wallet &nbsp;
        <small> required for lost password recovery</small>
        <small> COMING SOON </small>
        <svg
          className="AddItem"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
          <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
      </button>
      */}
      <Modal
        isShowing={isShowing.changePassword}
        hide={() => toggle('changePassword')}
      >
        <ChangePassword></ChangePassword>
      </Modal>
    </AccountListDiv>
  );
};

export default AccountList;
