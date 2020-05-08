import React, { useContext, useState, useEffect } from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';
import { withApollo, useQuery } from 'react-apollo';

import {
  CurrentUserContext,
  CurrentWalletContext,
  DaoServiceContext,
  DaoDataContext,
} from '../../contexts/Store';
import config from '../../config';
import { WalletStatuses } from '../../utils/WalletStatus';
import { truncateAddr } from '../../utils/Helpers';
import Arrow from '../../assets/DropArrow.svg';
import { useInterval } from '../../utils/PollingUtil';
import Deploy from './Deploy';
import UserTransactions from './UserTransactions';
import AccountList from './AccountList';
import DepositFormInitial from './DepositFormInitial';
import UpgradeKeystore from '../../auth/UpgradeKeystore';
import { USER_TYPE } from '../../utils/DaoService';
import { GET_MEMBER } from '../../utils/Queries';

import { FlashDiv, ButtonSecondary } from '../../variables.styles';
import { DataP, DataDiv, BackdropOpenDiv } from '../../App.styles';
import {
  WalletDiv,
  WalletHeaderDiv,
  WalletOverlayDiv,
  WalletOverlayContentsDiv,
  StatusP,
  AddressButton,
  ActionsDropdownDiv,
  SwitchHeaderDiv,
  SelectedElementButton,
  ActionsDropdownContentDiv,
  WalletContents,
  BalancesDiv,
  BalanceItemDiv,
  TinyButton,
} from './UserBalances.styles';

const UserBalance = ({ toggle }) => {
  const [daoData] = useContext(DaoDataContext);
  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [headerSwitch, setHeaderSwitch] = useState('Balances');
  const [keystoreExists, setKeystoreExists] = useState(true);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [memberAddressLoggedIn, setMemberAddressLoggedIn] = useState(false);
  const [memberAddress, setMemberAddress] = useState(false);

  const memberAddr =
    currentUser.type === USER_TYPE.SDK
      ? currentUser.attributes['custom:account_address'].toLowerCase()
      : currentUser.username.toLowerCase();
  const options = {
    pollInterval: 10000,
    variables: {
      id: `${daoData.contractAddress.toLowerCase()}-member-${memberAddr}`,
    },
  };

  const { loading, error, data } = useQuery(GET_MEMBER, options);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (error) {
      console.log('error', error);

      return;
    }
    if (!data || !data.member) {
      return;
    }
    console.log(data);
    
    setTokenBalances(data.member.tokenBalances);
    // eslint-disable-next-line
  }, [data]);

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

      const _memberAddress = await daoService.mcDao.memberAddressByDelegateKey(
        currentUser.attributes['custom:account_address'],
      );
      setMemberAddress(_memberAddress);
      setMemberAddressLoggedIn(
        currentUser &&
          currentUser.attributes['custom:account_address'] === _memberAddress,
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

  const renderBalances = (tokens) => {
    return tokens.map((token) => {
      return (
        <BalanceItemDiv key={token.token.tokenAddress}>
          <p>
            <a
              href={
                config.SDK_ENV === 'Kovan'
                  ? 'https://kovan.etherscan.io/token/' +
                    token.token.tokenAddress
                  : 'https://etherscan.io/token/' + token.token.tokenAddress
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              {token.token.symbol}
            </a>
          </p>
          <DataP>{token.tokenBalance / 10 ** token.token.decimals}</DataP>
        </BalanceItemDiv>
      );
    });
  };

  const withdrawBalances = (tokens) => {
    const tokensArr = tokens.map((token) => token.token.tokenAddress);
    const balancesArr = tokens.map((balance) => balance.tokenBalance);
    try {
      daoService.mcDao.withdrawBalances(tokensArr, balancesArr, true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WalletDiv>
      {/* <p>{currentWallet.state}</p>
      <p>{WalletStatuses.Deployed}</p> */}
      {currentWallet.state !== WalletStatuses.Connecting &&
        currentWallet.state === WalletStatuses.Created && (
          <WalletOverlayDiv>
            <WalletOverlayContentsDiv>
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
          </WalletOverlayDiv>
        )}
      {currentWallet.state === WalletStatuses.Deployed && !keystoreExists && (
        <WalletOverlayDiv>
          <WalletOverlayContentsDiv>
            <h2>Please upgrade your account.</h2>
            {!keystoreExists && <UpgradeKeystore />}
          </WalletOverlayContentsDiv>
        </WalletOverlayDiv>
      )}
      <WalletHeaderDiv>
        <div className="WalletInfo">
          <StatusP
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
            {currentWallet.jailed ? ' In Jail. proceed to ragequit.' : null}
            {!memberAddressLoggedIn && parseInt(memberAddress)
              ? ` as delegate for ${memberAddress &&
                  truncateAddr(memberAddress)}`
              : null}
            {data && data.member && data.member.delegateKey !== data.member.memberAddress ? ` (has delegate ${truncateAddr(data.member.delegateKey)})` : null}
          </StatusP>
          <CopyToClipboard
            onCopy={onCopy}
            text={currentUser.attributes['custom:account_address']}
          >
            <AddressButton>
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
            </AddressButton>
          </CopyToClipboard>
        </div>
        <ActionsDropdownDiv>
          <button onClick={() => toggleActions()}>
            Actions <img src={Arrow} alt="arrow" />
          </button>

          {actionsOpen ? (
            <>
              <BackdropOpenDiv onClick={toggleActions} />

              <ActionsDropdownContentDiv>
                {currentUser.type !== USER_TYPE.WEB3 && (
                  <ButtonSecondary onClick={() => toggleActions('depositForm')}>
                    Deposit
                  </ButtonSecondary>
                )}
                {currentWallet.state === WalletStatuses.Deployed && (
                  <ButtonSecondary onClick={() => toggleActions('sendEth')}>
                    Send ETH
                  </ButtonSecondary>
                )}
                {currentWallet.state === WalletStatuses.Deployed &&
                data.member ? (
                  <ButtonSecondary onClick={() => toggleActions('sendToken')}>
                    Send {data.member.moloch.tokenSymbol}
                  </ButtonSecondary>
                ) : null}
                {currentWallet.state === WalletStatuses.Deployed && (
                  <ButtonSecondary onClick={() => toggleActions('daohaus')}>
                    Manage on DAOHaus
                  </ButtonSecondary>
                )}
                {currentUser.type === USER_TYPE.WEB3 && (
                  <ButtonSecondary
                    onClick={() => toggleActions('ragequit')}
                    disabled={!memberAddressLoggedIn && parseInt(memberAddress)}
                  >
                    Rage Quit
                  </ButtonSecondary>
                )}
                {currentUser.type === USER_TYPE.WEB3 && (
                  <ButtonSecondary
                    onClick={() => toggleActions('changeDelegateKey')}
                    disabled={!memberAddressLoggedIn && parseInt(memberAddress)}
                  >
                    Change Delegate Key
                  </ButtonSecondary>
                )}
              </ActionsDropdownContentDiv>
            </>
          ) : null}
        </ActionsDropdownDiv>
      </WalletHeaderDiv>
      <SwitchHeaderDiv>
        <SelectedElementButton
          selected={headerSwitch === 'Balances'}
          onClick={() => setHeaderSwitch('Balances')}
        >
          Balances
        </SelectedElementButton>

        {daoData.version === 2 && (
          <SelectedElementButton
            selected={headerSwitch === 'InternalBalances'}
            onClick={() => setHeaderSwitch('InternalBalances')}
          >
            Internal Balances
          </SelectedElementButton>
        )}

        {daoData.version !== 2 && (
          <SelectedElementButton
            selected={headerSwitch === 'Transactions'}
            onClick={() => setHeaderSwitch('Transactions')}
          >
            Transactions
          </SelectedElementButton>
        )}

        {currentUser && currentUser.type === USER_TYPE.SDK && (
          <SelectedElementButton
            selected={headerSwitch === 'Accounts'}
            onClick={() => setHeaderSwitch('Accounts')}
          >
            Settings
          </SelectedElementButton>
        )}
      </SwitchHeaderDiv>
      <WalletContents>
        {headerSwitch === 'Balances' && (
          <BalancesDiv>
            <BalanceItemDiv>
              <p>Shares</p>
              <DataP>{currentWallet.shares}</DataP>
            </BalanceItemDiv>
            {+daoData.version === 2 && data ? (
              <BalanceItemDiv>
                <p>Loot</p>
                <DataP>{currentWallet.loot}</DataP>
              </BalanceItemDiv>
            ) : null}
            <BalanceItemDiv>
              <p>ETH</p>
              <DataDiv>
                {currentWallet.eth}
                {currentWallet.state !== WalletStatuses.Connecting &&
                  currentWallet.eth < 0.01 && (
                    <TinyButton onClick={() => toggle('depositForm')}>
                      <span>!</span> Low Eth
                    </TinyButton>
                  )}
              </DataDiv>
            </BalanceItemDiv>
            {currentWallet.shares > 0 || currentWallet.loot > 0 ? (
              <BalanceItemDiv>
                {+daoData.version === 2 && data && data.member ? (
                  <p>Deposit Token: {data.member.moloch.depositToken.symbol}</p>
                ) : (
                  <>{data && data.member && <p>{data.member.moloch.tokenSymbol}</p>}</>
                )}
                <DataDiv>
                  {currentWallet.tokenBalance}
                  {currentWallet.tokenBalance > currentWallet.allowance && (
                    <TinyButton onClick={() => toggle('allowanceForm')}>
                      <span>!</span> Unlock Token
                    </TinyButton>
                  )}
                </DataDiv>
              </BalanceItemDiv>
            ) : null}
          </BalancesDiv>
        )}
        {headerSwitch === 'InternalBalances' && daoData.version === 2 && (
          <BalancesDiv>
            {renderBalances(tokenBalances)}
            {tokenBalances.length && (
              <BalanceItemDiv>
                <button onClick={() => withdrawBalances(tokenBalances)}>
                  Withdraw Tokens
                </button>
              </BalanceItemDiv>
            )}
          </BalancesDiv>
        )}
        {headerSwitch === 'Transactions' && <UserTransactions />}
        {headerSwitch === 'Accounts' && <AccountList />}
      </WalletContents>
    </WalletDiv>
  );
};

export default withApollo(UserBalance);
