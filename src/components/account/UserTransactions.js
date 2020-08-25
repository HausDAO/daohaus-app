import React, { useContext } from 'react';
import styled from 'styled-components';

import { CurrentUserContext } from '../../contexts/Store';
import { BcProcessorService } from '../../utils/BcProcessorService';
import { getAppLight, getAppDark } from '../../variables.styles';
import EtherscanLink from '../shared/EtherscanLink';

const TransactionsDiv = styled.div`
  width: 100%;
  .Item {
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding: 15px 15px;
    flex-direction: row;
    background-color: ${(props) => getAppLight(props.theme)};
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
    border-bottom: 1px solid ${(props) => getAppDark(props.theme)};
  }
`;

const UserTransactions = () => {
  // TODO kovan is hardcoded here so will break rinkeby
  const bcprocessor = new BcProcessorService();

  const [currentUser] = useContext(CurrentUserContext);

  const renderList = () => {
    return bcprocessor
      .getTxList(currentUser.attributes['custom:account_address'])
      .map((tx) => {
        return (
          <div className="Item" key={tx.tx}>
            <div className="Description">
              <p className="Description__Title">{tx.description}</p>
              <p className="Data">
                <EtherscanLink
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
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000"
                  >
                    <g fill="none" fillRule="evenodd" strokeWidth="2">
                      <circle cx="22" cy="22" r="1">
                        <animate
                          attributeName="r"
                          begin="0s"
                          dur="1.8s"
                          values="1; 20"
                          calcMode="spline"
                          keyTimes="0; 1"
                          keySplines="0.165, 0.84, 0.44, 1"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-opacity"
                          begin="0s"
                          dur="1.8s"
                          values="1; 0"
                          calcMode="spline"
                          keyTimes="0; 1"
                          keySplines="0.3, 0.61, 0.355, 1"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="22" cy="22" r="1">
                        <animate
                          attributeName="r"
                          begin="-0.9s"
                          dur="1.8s"
                          values="1; 20"
                          calcMode="spline"
                          keyTimes="0; 1"
                          keySplines="0.165, 0.84, 0.44, 1"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-opacity"
                          begin="-0.9s"
                          dur="1.8s"
                          values="1; 0"
                          calcMode="spline"
                          keyTimes="0; 1"
                          keySplines="0.3, 0.61, 0.355, 1"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  </svg>
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
    <TransactionsDiv>{currentUser && <>{renderList()}</>}</TransactionsDiv>
  );
};

export default UserTransactions;
