import React, { useContext, useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import {
  CurrentUserContext,
  CurrentWalletContext,
  DaoServiceContext,
  ThemeContext,
} from '../../contexts/Store';
import { WalletStatuses } from '../../utils/WalletStatus';
import { truncateAddr } from '../../utils/Helpers';
import Arrow from '../../assets/DropArrow.svg';
import { useInterval } from '../../utils/PollingUtil';
import Deploy from './Deploy';
import UserTransactions from './UserTransactions';
import AccountList from './AccountList';

import DepositFormInitial from './DepositFormInitial';
import { withApollo } from 'react-apollo';
import { GET_METADATA } from '../../utils/Queries';
import UpgradeKeystore from '../../auth/UpgradeKeystore';
import { USER_TYPE } from '../../utils/DaoService';
import styled from 'styled-components';
import {
  secondary,
  primaryHover,
  secondaryHover,
  tertiaryHover,
  phone,
  danger,
  primary,
  tertiary,
  appLight,
  FlashDiv,
  ButtonSecondary,
  dangerHover,
} from '../../variables.styles';
import {
  FlexCenterDiv,
  DataButton,
  DataP,
  BackdropOpenDiv,
} from '../../App.styles';

const WalletDiv = styled.div`
  border: 1px solid #efefef;
  border-radius: 10px;
  position: relative;
  top: -2px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: ${appLight};
  @media (max-width: ${phone}) {
    border-radius: 0px;
    border: none;
  }
  @media (min-width: ${phone}) {
    width: 60%;
    margin: 25px auto;
    position: relative;
  }
`;

const WalletHeaderDiv = styled.div`
  height: 98px;
  border-bottom: 1px solid ${primaryHover};
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${primaryHover};
  padding: 0 15px;
  @media (max-width: ${phone}) {
    border-radius: 0px;
    border: none;
  }
`;

const WalletOverlayDiv = styled(FlexCenterDiv)`
  width: 100%;
  min-height: 100%;
  position: absolute;
  z-index: 1;
  background-color: ${primary};
  color: white;
  border: none;
  p {
    text-align: center;
  }
  @media (min-width: ${phone}) {
    border-radius: 10px;
    border: none;
  }
`;

const WalletOverlayContentsDiv = styled(FlexCenterDiv)`
  padding: 50px;
`;

const StatusP = styled.p`
  font-size: 0.85em;
  position: relative;
  color: ${(props) => (props.status === 'disconnected' ? danger : secondary)};
  margin-left: 15px;
  margin-top: 0;
  margin-bottom: 5px;
  &:before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) =>
    props.status === 'disconnected' ? danger : secondary};
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-left: -15px;
  }
`;

const AddressButton = styled(DataButton)`
  margin: 0;
  padding: 0px;
  border: none;
  background: none;
  color: white;
  width: auto;
  display: flex;
  align-content: center;
  &:hover {
    color: ${secondary};
    fill: ${secondary};
  }
  p {
    color: white;
  }
  svg {
    display: inline-block;
    fill: ${secondary};
    width: 18px;
    height: 18px;
    margin-left: 5px;
  }
`;

const ActionsDropdownDiv = styled.div`
  color: ${appLight};
  position: relative;
  button {
    background-color: transparent;
    img {
      margin-left: 5px;
      vertical-align: middle;
    }
  }
`;

const SwitchHeaderDiv = styled.div`
  width: calc(100% - 30px);
  background-color: #911094; //TODO: this color is not a variable
  display: flex;
  justify-content: flex-start;
  padding: 0px 15px;
  button {
    color: ${secondary};
    background-color: transparent;
    border-radius: 0px;
    margin: 0;
    margin-right: 25px;
    border-bottom: 4px solid transparent;
    padding: 15px 0px;
  }
`;

const SelectedElementButton = styled.button`
  color: ${(props) => (props.selected ? '#ffffff' : '')};
  border-bottom: ${(props) => (props.selected ? '4px solid' + secondary : '')};
  background-color: ${(props) => (props.selected ? 'transparent' : '')};
  font-size: ${(props) => (props.selected ? '1em' : '')};
`;

const ActionsDropdownContentDiv = styled.div`
  position: absolute;
  right: -15px;
  background-color: ${appLight};
  min-width: 200px;
  max-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  z-index: 3;
  button {
    background-color: transparent;
    color: ${primary};
    text-align: left;
    padding: 15px 0px;
    margin: 0;
    &:hover {
      color: ${primaryHover};
    }
    &.Button--Primary {
      color: ${primary};
      &:hover {
        color: ${primaryHover};
      }
    }
    &.Button--Secondary {
      color: ${secondary};
      &:hover {
        color: ${secondaryHover};
      }
      &:disabled {
        color: grey;
      }
    }
    &.Button--Tertiary {
      color: ${tertiary};
      &:hover {
        color: ${tertiaryHover};
      }
    }
  }
`;

const WalletContents = styled.div`
  min-height: 300px;
`;

const BalancesDiv = styled.div`
  min-height: 300px;
`;

const BalanceItemDiv = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  padding: 15px 15px;
  flex-direction: column;
  background-color: $app-light;
  @media (min-width: $tablet) {
    flex-direction: column;
  }
  p {
    margin: 0;
    padding: 0px;
  }
  border-bottom: 1px solid #efefef;
  p:nth-child(1) {
    font-size: 0.85em;
    color: #333;
  }
  p:nth-child(2) {
    font-size: 1.5em;
  }
`;

export const TinyButton = styled.div`
  margin: 0;
  display: inline-block;
  font-size: 0.5em;
  padding: 7px 10px;
  vertical-align: middle;
  margin-top: -5px;
  margin-left: 10px;
  background-color: ${danger};
  &:hover {
    background-color: ${dangerHover};
  }
  span {
    color: white;
    height: 13px;
    width: 13px;
    border-radius: 50%;
    border: 1px solid white;
    font-size: 0.85em;
    float: left;
    margin-right: 5px;
  }
`;



const ThemedWalletDiv = styled(WalletDiv)`
  background-color: ${({ themeVariables }) => themeVariables.appLight};
  @media (max-width: ${({ themeVariables }) => themeVariables.phone}) {
    border-radius: 0px;
    border: none;
  }
  @media (min-width: ${({ themeVariables }) => themeVariables.phone}) {
    width: 60%;
    margin: 25px auto;
    position: relative;
  }
`;

const ThemedWalletHeaderDiv = styled(WalletHeaderDiv)`
  border-bottom: 1px solid ${({ themeVariables }) => themeVariables.primaryHover};
  background-color: ${({ themeVariables }) => themeVariables.primaryHover};
  @media (max-width: ${({ themeVariables }) => themeVariables.phone}) {
    border-radius: 0px;
    border: none;
  }
`;

const TemedWalletOverlayDiv = styled(WalletOverlayDiv)`
  background-color: ${({ themeVariables }) => themeVariables.primary};
  @media (min-width: ${({ themeVariables }) => themeVariables.phone}) {
    border-radius: 10px;
    border: none;
  }
`;

const ThemedStatusP = styled(StatusP)`
  color: ${(props) => (props.status === 'disconnected' ? props.themeVariables.danger : props.themeVariables.secondary)};
  &:before {
    background-color: ${(props) =>
    props.status === 'disconnected' ? props.themeVariables.danger : props.themeVariables.secondary};
  }
`;

const ThemedAddressButton = styled(AddressButton)`
  &:hover {
    color: ${({ themeVariables }) => themeVariables.secondary};
    fill: ${({ themeVariables }) => themeVariables.secondary};
  }
  p {
    color: white;
  }
  svg {
    fill: ${({ themeVariables }) => themeVariables.secondary};
  }
`;

const ThemedActionsDropdownDiv = styled(ActionsDropdownDiv)`
  color: ${({ themeVariables }) => themeVariables.appLight};
`;

const ThemedSwitchHeaderDiv = styled(SwitchHeaderDiv)`
  background-color: ${({ themeVariables }) => themeVariables.primary};

  button {
    color: ${({ themeVariables }) => themeVariables.secondary};
  }
`;

const ThemedSelectedElementButton = styled(SelectedElementButton)`
  border-bottom: ${(props) => (props.selected ? '4px solid' + props.themeVariables.secondary : '')};
`;

const ThemedActionsDropdownContentDiv = styled(ActionsDropdownContentDiv)`
  background-color: ${({ themeVariables }) => themeVariables.appLight};
  button {
    color: ${({ themeVariables }) => themeVariables.primary};
    &:hover {
      color: ${({ themeVariables }) => themeVariables.primaryHover};
    }
    &.Button--Primary {
      color: ${({ themeVariables }) => themeVariables.primary};
      &:hover {
        color: ${({ themeVariables }) => themeVariables.primaryHover};
      }
    }
    &.Button--Secondary {
      color: ${({ themeVariables }) => themeVariables.secondary};
      &:hover {
        color: ${({ themeVariables }) => themeVariables.secondaryHover};
      }
      &:disabled {
        color: grey;
      }
    }
    &.Button--Tertiary {
      color: ${({ themeVariables }) => themeVariables.tertiary};
      &:hover {
        color: ${({ themeVariables }) => themeVariables.tertiaryHover};
      }
    }
  }
`;

const ThemedTinyButton = styled(TinyButton)`
  background-color: ${({ themeVariables }) => themeVariables.danger};
  &:hover {
    background-color: ${({ themeVariables }) => themeVariables.dangerHover};
  }
`;

const UserBalance = ({ toggle, client }) => {
  const { tokenSymbol } = client.cache.readQuery({
    query: GET_METADATA,
  });

  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [themeVariables] = useContext(ThemeContext);
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
    <ThemedWalletDiv themeVariables={themeVariables}>
      {/* <p>{currentWallet.state}</p>
      <p>{WalletStatuses.Deployed}</p> */}
      {currentWallet.state !== WalletStatuses.Connecting &&
        currentWallet.state === WalletStatuses.Created && (
          <TemedWalletOverlayDiv themeVariables={themeVariables}>
            <WalletOverlayContentsDiv themeVariables={themeVariables}>
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
            </WalletOverlayContentsDiv>
          </TemedWalletOverlayDiv>
        )}
      {currentWallet.state === WalletStatuses.Deployed && !keystoreExists && (
        <WalletOverlayDiv>
          <WalletOverlayContentsDiv>
            <h2>Please upgrade your account.</h2>
            {!keystoreExists && <UpgradeKeystore />}
          </WalletOverlayContentsDiv>
        </WalletOverlayDiv>
      )}
      <ThemedWalletHeaderDiv themeVariables={themeVariables}>
        <div className="WalletInfo">
          <ThemedStatusP themeVariables={themeVariables}
            status={
              (currentUser.type === USER_TYPE.SDK &&
                currentWallet.state !== 'Deployed') ||
                (currentUser.type === USER_TYPE.WEB3 &&
                  currentWallet.state !== 'Connected')
                ? 'Disconnected'
                : ''
            }
          >
            {currentWallet.state || 'Connecting'}
          </ThemedStatusP>
          <CopyToClipboard
            onCopy={onCopy}
            text={currentUser.attributes['custom:account_address']}
          >
            <ThemedAddressButton>
              <DataP>
                {truncateAddr(currentUser.attributes['custom:account_address'])}
              </DataP>{' '}
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
                <FlashDiv>
                  <p>Copied!</p>
                </FlashDiv>
              )}
            </ThemedAddressButton>
          </CopyToClipboard>
        </div>
        <ThemedActionsDropdownDiv themeVariables={themeVariables}>
          <button onClick={() => toggleActions()}>
            Actions <img src={Arrow} alt="arrow" />
          </button>

          {actionsOpen ? (
            <>
              <BackdropOpenDiv onClick={toggleActions} />

              <ThemedActionsDropdownContentDiv themeVariables={themeVariables}>
                <ButtonSecondary onClick={() => toggleActions('depositForm')}>
                  Deposit
                </ButtonSecondary>
                {currentWallet.state === WalletStatuses.Deployed && (
                  <ButtonSecondary onClick={() => toggleActions('sendEth')}>
                    Send ETH
                  </ButtonSecondary>
                )}
                {currentWallet.state === WalletStatuses.Deployed && (
                  <ButtonSecondary onClick={() => toggleActions('sendToken')}>
                    Send {tokenSymbol}
                  </ButtonSecondary>
                )}
                {currentWallet.state === WalletStatuses.Deployed && (
                  <ButtonSecondary onClick={() => toggleActions('daohaus')}>
                    Manage on DAOHaus
                  </ButtonSecondary>
                )}
                {currentUser.type === USER_TYPE.WEB3 &&
                  currentWallet.shares > 0 && (
                    <ButtonSecondary
                      onClick={() => toggleActions('ragequit')}
                      disabled={!memberAddressLoggedIn}
                    >
                      Rage Quit
                    </ButtonSecondary>
                  )}
                {currentUser.type === USER_TYPE.WEB3 &&
                  currentWallet.shares > 0 && (
                    <ButtonSecondary
                      onClick={() => toggleActions('changeDelegateKey')}
                      disabled={!memberAddressLoggedIn}
                    >
                      Change Delegate Key
                    </ButtonSecondary>
                  )}
              </ThemedActionsDropdownContentDiv>
            </>
          ) : null}
        </ThemedActionsDropdownDiv>
      </ThemedWalletHeaderDiv>
      <ThemedSwitchHeaderDiv themeVariables={themeVariables}>
        <ThemedSelectedElementButton
          themeVariables={themeVariables}
          selected={headerSwitch === 'Balances'}
          onClick={() => setHeaderSwitch('Balances')}
        >
          Balances
        </ThemedSelectedElementButton>
        <ThemedSelectedElementButton
          selected={headerSwitch === 'Transactions'}
          onClick={() => setHeaderSwitch('Transactions')}
        >
          Transactions
        </ThemedSelectedElementButton>
        {currentUser && currentUser.type === USER_TYPE.SDK && (
          <ThemedSelectedElementButton
            selected={headerSwitch === 'Accounts'}
            onClick={() => setHeaderSwitch('Accounts')}
          >
            Settings
          </ThemedSelectedElementButton>
        )}
      </ThemedSwitchHeaderDiv>
      <WalletContents>
        {headerSwitch === 'Balances' && (
          <BalancesDiv>
            <BalanceItemDiv>
              <p>Shares</p>
              <DataP>{currentWallet.shares}</DataP>
            </BalanceItemDiv>
            <BalanceItemDiv>
              <p>ETH</p>
              <DataP>
                {currentWallet.eth}
                {currentWallet.state !== WalletStatuses.Connecting &&
                  currentWallet.eth < 0.01 && (
                    <ThemedTinyButton onClick={() => toggle('depositForm')}>
                      <span>!</span> Low Eth
                    </ThemedTinyButton>
                  )}
              </DataP>
            </BalanceItemDiv>
            <BalanceItemDiv>
              <p>{tokenSymbol}</p>
              <DataP>
                {currentWallet.tokenBalance}
                {currentWallet.tokenBalance > currentWallet.allowance && (
                  <TinyButton onClick={() => toggle('allowanceForm')}>
                    <span>!</span> Unlock Token
                  </TinyButton>
                )}
              </DataP>
            </BalanceItemDiv>
          </BalancesDiv>
        )}
        {headerSwitch === 'Transactions' && <UserTransactions />}
        {headerSwitch === 'Accounts' && <AccountList />}
      </WalletContents>
    </ThemedWalletDiv>
  );
};

export default withApollo(UserBalance);
