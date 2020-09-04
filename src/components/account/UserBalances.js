import React, { useContext, useState, useEffect } from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';
import { withApollo, useQuery } from 'react-apollo';

import {
  CurrentUserContext,
  CurrentWalletContext,
  DaoServiceContext,
  DaoDataContext,
} from '../../contexts/Store';
import { truncateAddr } from '../../utils/Helpers';
import Arrow from '../../assets/DropArrow.svg';
import { useInterval } from '../../utils/PollingUtil';
import UserTransactions from './UserTransactions';
import { USER_TYPE } from '../../utils/DaoService';
import { GET_MEMBER } from '../../utils/Queries';

import { FlashDiv, ButtonSecondary } from '../../variables.styles';
import { DataP, DataDiv, BackdropOpenDiv } from '../../App.styles';
import {
  WalletDiv,
  WalletHeaderDiv,
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
import EtherscanLink from '../shared/EtherscanLink';

const UserBalance = ({ toggle }) => {
  const [daoData] = useContext(DaoDataContext);
  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [headerSwitch, setHeaderSwitch] = useState('Balances');
  const [tokenBalances, setTokenBalances] = useState([]);
  const [memberAddressLoggedIn, setMemberAddressLoggedIn] = useState(false);
  const [memberAddress, setMemberAddress] = useState(false);

  const memberAddr = currentUser.username.toLowerCase();
  const options = {
    pollInterval: 60000,
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

    setTokenBalances(data.member.tokenBalances);
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    (async () => {
      if (!daoService.mcDao) {
        return;
      }

      const _memberAddress = await daoService.mcDao.memberAddressByDelegateKey(
        currentUser.username,
      );

      setMemberAddress(_memberAddress);
      setMemberAddressLoggedIn(
        currentUser &&
          currentUser.username.toLowerCase() === _memberAddress.toLowerCase(),
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
          <EtherscanLink
            type="address"
            hash={token.token.tokenAddress}
            linkText={token.token.symbol}
          />
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
      <WalletHeaderDiv>
        <div className="WalletInfo">
          <StatusP status={currentUser.type === USER_TYPE.WEB3}>
            Connected
            {currentWallet.jailed ? ' In Jail. proceed to ragequit.' : null}
            {!memberAddressLoggedIn && parseInt(memberAddress)
              ? ` as delegate for ${memberAddress &&
                  truncateAddr(memberAddress)}`
              : null}
            {data &&
            data.member &&
            data.member.delegateKey !== data.member.memberAddress
              ? ` (has delegate ${truncateAddr(data.member.delegateKey)})`
              : null}
          </StatusP>
          <CopyToClipboard onCopy={onCopy} text={currentUser.username}>
            <AddressButton>
              <DataP>{truncateAddr(currentUser.username)}</DataP>{' '}
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
                {currentUser.type === USER_TYPE.WEB3 ? (
                  <>
                    <ButtonSecondary
                      onClick={() => toggleActions('ragequit')}
                      disabled={
                        !memberAddressLoggedIn && parseInt(memberAddress)
                      }
                    >
                      Rage Quit
                    </ButtonSecondary>

                    <ButtonSecondary
                      onClick={() => toggleActions('changeDelegateKey')}
                      disabled={
                        !memberAddressLoggedIn && parseInt(memberAddress)
                      }
                    >
                      Change Delegate Key
                    </ButtonSecondary>
                  </>
                ) : null}
                <ButtonSecondary>
                  <a
                    className="Button"
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://wrapeth.com/"
                  >
                    Wrap Eth
                  </a>
                </ButtonSecondary>
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

        <SelectedElementButton
          selected={headerSwitch === 'Transactions'}
          onClick={() => setHeaderSwitch('Transactions')}
        >
          Transactions
        </SelectedElementButton>
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
                <p>Loot (Non-voting Shares)</p>
                <DataP>{currentWallet.loot}</DataP>
              </BalanceItemDiv>
            ) : null}
            <BalanceItemDiv>
              <p>
                {+process.env.REACT_APP_NETWORK_ID === 100 ? 'XDAI' : 'ETH'}
              </p>
              <DataDiv>
                {currentWallet.eth}
                {currentWallet.eth < 0.01 ? (
                  <TinyButton onClick={() => toggle('depositForm')}>
                    <span>!</span> Low{' '}
                    {+process.env.REACT_APP_NETWORK_ID === 100 ? 'XDAI' : 'ETH'}
                  </TinyButton>
                ) : null}
              </DataDiv>
            </BalanceItemDiv>
            {currentWallet.shares > 0 || currentWallet.loot > 0 ? (
              <BalanceItemDiv>
                {+daoData.version === 2 && data && data.member ? (
                  <p>Deposit Token: {data.member.moloch.depositToken.symbol}</p>
                ) : (
                  <>
                    {data && data.member && (
                      <p>{data.member.moloch.tokenSymbol}</p>
                    )}
                  </>
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
      </WalletContents>
    </WalletDiv>
  );
};

export default withApollo(UserBalance);
