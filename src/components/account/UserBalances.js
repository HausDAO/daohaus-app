import React, { useContext, useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import {
  CurrentUserContext,
  CurrentWalletContext,
  DaoServiceContext,
} from '../../contexts/Store';
import { WalletStatuses } from '../../utils/WalletStatus';
import { truncateAddr } from '../../utils/Helpers';
import Arrow from '../../assets/DropArrow.svg';
import { useInterval } from '../../utils/PollingUtil';
import Deploy from './Deploy';
import UserTransactions from './UserTransactions';
import AccountList from './AccountList';

import './UserWallet.scss';
import DepositFormInitial from './DepositFormInitial';
import { withApollo } from 'react-apollo';
import { GET_METADATA } from '../../utils/Queries';
import UpgradeKeystore from '../../auth/UpgradeKeystore';
import { USER_TYPE } from '../../utils/DaoService';

const UserBalance = ({ toggle, client }) => {
  const { tokenSymbol } = client.cache.readQuery({
    query: GET_METADATA,
  });

  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [headerSwitch, setHeaderSwitch] = useState('Balances');
  const [keystoreExists, setKeystoreExists] = useState(true);
  const [memberAddressLoggedIn, setMemberAddressLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      if (!daoService.mcDao) {
        return;
      }

      if (currentUser && currentUser.type === USER_TYPE.SDK) {
        try {
          const userAttributes = currentUser.attributes;

          setKeystoreExists(!!userAttributes['custom:encrypted_ks']);
        } catch (error) {
          console.error(error);
        }
      }

      const memberAddress = await daoService.mcDao.memberAddressByDelegateKey(
        currentUser.attributes['custom:account_address'],
      );
      setMemberAddressLoggedIn(
        currentUser &&
          currentUser.attributes['custom:account_address'] === memberAddress,
      );
    })();
  }, [currentUser, daoService.mcDao]);

  const onCopy = () => {
    setDelay(2500);
    setCopied(true);
  };

  useInterval(() => {
    setCopied(false);
    setDelay(null);
  }, delay);

  const toggleActions = (modal) => {
    if (modal) {
      toggle(modal);
      setActionsOpen(false);
    } else {
      setActionsOpen(!actionsOpen);
    }
  };

  return (
    <div className="Wallet">
      {/* <p>{currentWallet.state}</p>
      <p>{WalletStatuses.Deployed}</p> */}
      {currentWallet.state !== WalletStatuses.Connecting &&
        currentWallet.state === WalletStatuses.Created && (
          <div className="WalletOverlay FlexCenter">
            <div className="Contents FlexCenter">
              {currentWallet.eth < 0.05 && <DepositFormInitial />}
              {currentWallet.eth >= 0.05 && (
                <>
                  <h3>
                    <span role="img" aria-label="party popper">
                      🎉
                    </span>{' '}
                    Congrats!{' '}
                    <span role="img" aria-label="party popper">
                      🎉
                    </span>
                  </h3>
                  <h2>Your account is ready to deploy.</h2>
                  <Deploy />
                </>
              )}
              {!keystoreExists && (
                <p>
                  Contact Support in{' '}
                  <a href="https://t.me/joinchat/IJqu9xeMfqWoLnO_kc03QA">
                    Telegram
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      {currentWallet.state === WalletStatuses.Deployed && !keystoreExists && (
        <div className="WalletOverlay FlexCenter">
          <div className="Contents FlexCenter">
            <h2>Please upgrade your account.</h2>
            {!keystoreExists && <UpgradeKeystore />}
          </div>
        </div>
      )}
      <div className="Header">
        <div className="WalletInfo">
          <p
            className={
              'Status ' +
              ((currentUser.type === USER_TYPE.SDK &&
                currentWallet.state !== 'Deployed') ||
              (currentUser.type === USER_TYPE.WEB3 &&
                currentWallet.state !== 'Connected')
                ? 'Disconnected'
                : '')
            }
          >
            {currentWallet.state || 'Connecting'}
          </p>
          <CopyToClipboard
            onCopy={onCopy}
            text={currentUser.attributes['custom:account_address']}
          >
            <button className="Address Data">
              <p className="Data">
                {truncateAddr(currentUser.attributes['custom:account_address'])}
              </p>{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path fill="none" d="M0 0h24v24H0V0z" />
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z" />
              </svg>
              {copied && (
                <div className="Flash">
                  <p>Copied!</p>
                </div>
              )}
            </button>
          </CopyToClipboard>
        </div>
        <div className="ActionsDropdown">
          <button onClick={() => toggleActions()}>
            Actions <img src={Arrow} alt="arrow" />
          </button>

          {actionsOpen ? (
            <>
              <div
                className={
                  actionsOpen ? 'Backdrop__Open Blank' : 'Backdrop Blank'
                }
                onClick={toggleActions}
              />

              <div className="ActionsDropdownContent">
                <button
                  onClick={() => toggleActions('depositForm')}
                  className="Button--Secondary"
                >
                  Deposit
                </button>
                {currentWallet.state === WalletStatuses.Deployed && (
                  <button
                    className="Button--Secondary"
                    onClick={() => toggleActions('sendEth')}
                  >
                    Send ETH
                  </button>
                )}
                {currentWallet.state === WalletStatuses.Deployed && (
                  <button
                    className="Button--Secondary"
                    onClick={() => toggleActions('sendToken')}
                  >
                    Send {tokenSymbol}
                  </button>
                )}
                {currentWallet.state === WalletStatuses.Deployed && (
                  <button
                    className="Button--Secondary"
                    onClick={() => toggleActions('daohaus')}
                  >
                    Manage on DAOHaus
                  </button>
                )}
                {currentUser.type === USER_TYPE.WEB3 &&
                  currentWallet.shares > 0 && (
                    <button
                      onClick={() => toggleActions('ragequit')}
                      className="Button--Secondary"
                      disabled={!memberAddressLoggedIn}
                    >
                      Rage Quit
                    </button>
                  )}
                {currentUser.type === USER_TYPE.WEB3 &&
                  currentWallet.shares > 0 && (
                    <button
                      onClick={() => toggleActions('changeDelegateKey')}
                      className="Button--Secondary"
                      disabled={!memberAddressLoggedIn}
                    >
                      Change Delegate Key
                    </button>
                  )}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="SwitchHeader">
        <button
          className={headerSwitch === 'Balances' ? 'Tab SelectedElement' : ''}
          onClick={() => setHeaderSwitch('Balances')}
        >
          Balances
        </button>
        <button
          className={
            headerSwitch === 'Transactions' ? 'Tab SelectedElement' : ''
          }
          onClick={() => setHeaderSwitch('Transactions')}
        >
          Transactions
        </button>
        {currentUser && currentUser.type === USER_TYPE.SDK && (
          <button
            className={headerSwitch === 'Accounts' ? 'Tab SelectedElement' : ''}
            onClick={() => setHeaderSwitch('Accounts')}
          >
            Settings
          </button>
        )}
      </div>
      <div className="Contents">
        {headerSwitch === 'Balances' && (
          <div className="Balances">
            <div className="Item">
              <p>Shares</p>
              <p className="Data">{currentWallet.shares}</p>
            </div>
            <div className="Item">
              <p>ETH</p>
              <p className="Data">
                {currentWallet.eth}
                {currentWallet.state !== WalletStatuses.Connecting &&
                  currentWallet.eth < 0.01 && (
                    <button
                      className="TinyButton"
                      onClick={() => toggle('depositForm')}
                    >
                      <span>!</span> Low Eth
                    </button>
                  )}
              </p>
            </div>
            <div className="Item">
              <p>{tokenSymbol}</p>
              <p className="Data">
                {currentWallet.tokenBalance}
                {currentWallet.tokenBalance > currentWallet.allowance && (
                  <button
                    className="TinyButton"
                    onClick={() => toggle('allowanceForm')}
                  >
                    <span>!</span> Unlock Token
                  </button>
                )}
              </p>
            </div>
          </div>
        )}
        {headerSwitch === 'Transactions' && <UserTransactions />}
        {headerSwitch === 'Accounts' && <AccountList />}
      </div>
      <div className="Wallet__Footer">
        <p className="Powered">
          {/* &nbsp;Powered by <a href="http://abridged.io">Abridged</a> */}
        </p>
      </div>
    </div>
  );
};

export default withApollo(UserBalance);
