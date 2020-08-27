import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import {
  CurrentUserContext,
  CurrentWalletContext,
  DaoServiceContext,
} from '../../contexts/Store';
import { WalletStatuses } from '../../utils/WalletStatus';
import IconProcessing from './IconProcessing';

import styled from 'styled-components';
import {
  getSecondaryHover,
  getDangerHover,
  getAppDark,
  getAppLight,
} from '../../variables.styles';

import { USER_TYPE } from '../../utils/DaoService';
import EtherscanLink from './EtherscanLink';

const ProcessorDiv = styled.div`
  position: absolute;
  z-index: 2;
  width: 36px;
  height: 62px;
  top: 50%;
  transform: translateY(-50%);
  right: 128px;
`;

const ProcessorButton = styled.button`
  position: absolute;
  width: 36px;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  svg {
    fill: ${(props) => props.theme.secondary};
    width: 36px;
    height: 36px;
  }
  margin: 0;
  padding: 0px;
  &:hover {
    background: none;
    svg {
      fill: ${(props) => getSecondaryHover(props.theme)};
    }
  }
`;

const ProcessorDropdownDiv = styled.div`
  transition: all 0.15s linear;
  position: ${(props) => (props.isElementOpen ? 'absolute' : 'absolute')};
  width: ${(props) => (props.isElementOpen ? '100%' : '100%')};
  height: ${(props) => (props.isElementOpen ? 'auto' : '0px')};
  max-width: ${(props) => (props.isElementOpen ? '600px' : '600px')};
  overflow: ${(props) => (props.isElementOpen ? 'visible' : 'hidden')};
  top: 0px;
  right: 0;
  z-index: ${(props) => (props.isElementOpen ? '2' : '-1')};
`;

const ToastDiv = styled.div`
  position: absolute;
  top: 64px;
  right: -15px;
  width: calc(100% + 30px);
  max-width: 600px;
  margin: 0 auto;
  .Item {
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding: 15px 15px;
    flex-direction: row;
    background-color: ${(props) => getAppLight(props.theme)};
    border-bottom: 1px solid ${(props) => getAppDark(props.theme)};
    .Description {
      display: flex;
      align-content: center;
      justify-content: flex-start;
      flex-direction: column;
      &__Title {
        font-size: 1em;
        margin: 0;
        margin-bottom: 5px;
        margin-top: 5px;
      }
    }
    .Status {
      display: flex;
      align-content: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      width: 80px;
      svg {
        width: 36px;
        height: 36px;
      }
    }
    p:not(.Description__Title) {
      font-size: 0.85em;
      margin: 0;
      color: #aaa;
    }
  }
`;

const BcStaticDiv = styled.div`
  margin: 0;
  padding: 6px;
  .BcStatic__Inner {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.secondary};
    transition: all 0.15s linear;
    &:hover {
      background-color: ${(props) => getSecondaryHover(props.theme)};
    }
    &.WarningIcon {
      background-color: ${(props) => props.theme.danger};
      position: relative;
      &:after {
        content: '!';
        font-family: ${(props) => props.theme.baseFont};
        font-size: 0.85em;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-weight: 900;
      }
      &:hover {
        background-color: ${(props) => getDangerHover(props.theme)};
      }
    }
  }
`;

const DropdownFooterDiv = styled.div`
  width: calc(100% - 30px);
  background: ${(props) => getAppLight(props.theme)};
  padding: 15px 15px;
  border-bottom: 1px solid ${(props) => getAppDark(props.theme)};
`;

const BcToast = () => {
  const [daoService] = useContext(DaoServiceContext);

  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  const [isElementOpen, setElementOpen] = React.useState(false);
  const toggleElement = () => setElementOpen(!isElementOpen);

  const pendingLength = () => {
    return daoService.bcProcessor.getTxPendingList(
      currentUser.attributes['custom:account_address'],
    ).length;
  };

  const renderList = () => {
    return daoService.bcProcessor
      .getTxList(currentUser.attributes['custom:account_address'])
      .slice(-3)
      .reverse()
      .map((tx) => {
        return (
          <div className="Item" key={tx.tx}>
            <div className="Description">
              <p className="Description__Title">{tx.description}</p>
              <p className="Data">
                <EtherscanLink
                  onClick={toggleElement}
                  type="tx"
                  hash={tx.tx}
                  linkText={
                    process.env.REACT_APP_NETWORK_ID === '100'
                      ? 'Check on Blockscout'
                      : 'Check on Etherscan'
                  }
                />
              </p>
            </div>
            <div className="Status">
              {tx.open && (
                <p className="Status__Svg">
                  <IconProcessing />
                </p>
              )}
              {!tx.open && (
                <p className="Status__Svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path
                      fill="#42B44A"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"
                    />
                  </svg>
                </p>
              )}
              <p className="Data">{tx.open ? 'pending' : 'confirmed'}</p>
            </div>
          </div>
        );
      });
  };

  return (
    currentUser && (
      <>
        <div
          className={isElementOpen ? 'Backdrop__Open' : 'Backdrop'}
          onClick={toggleElement}
        />
        <ProcessorDiv>
          {currentUser.type === USER_TYPE.WEB3 &&
          currentWallet.state === WalletStatuses.Connected ? (
            <ProcessorButton onClick={toggleElement}>
              {pendingLength() ? (
                <IconProcessing />
              ) : (
                <BcStaticDiv>
                  <div className="BcStatic__Inner" />
                </BcStaticDiv>
              )}
            </ProcessorButton>
          ) : (
            <Link className="Processor__Button" to="/account">
              <BcStaticDiv>
                <div className="BcStatic__Inner WarningIcon" />
              </BcStaticDiv>
            </Link>
          )}
        </ProcessorDiv>
        <ProcessorDropdownDiv isElementOpen={isElementOpen}>
          <ToastDiv>
            {renderList()}
            <DropdownFooterDiv>
              <Link
                to={`/dao/${daoService.accountAddr}/account`}
                onClick={toggleElement}
              >
                View all transactions
              </Link>
            </DropdownFooterDiv>
          </ToastDiv>
        </ProcessorDropdownDiv>
      </>
    )
  );
};

export default BcToast;
