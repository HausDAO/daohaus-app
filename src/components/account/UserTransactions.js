import React, { useContext } from 'react';

import { CurrentUserContext } from '../../contexts/Store';
import BcProcessorService from '../../utils/BcProcessorService';
import config from '../../config';

const UserTransactions = () => {
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
                <a
                  href={
                    config.SDK_ENV === 'Kovan'
                      ? 'https://kovan.etherscan.io/tx/' + tx.tx
                      : 'https://etherscan.io/tx/' + tx.tx
                  }
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Check on Etherscan
                </a>
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
    <div className="Transactions">
      {currentUser && (
        <>
          {renderList()}
        </>
      )}
    </div>
  );
};

export default UserTransactions;
