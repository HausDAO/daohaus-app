import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';
import { WalletStatuses } from '../../utils/WalletStatus';
import BcProcessorService from '../../utils/BcProcessorService';
import IconProcessing from './IconProcessing';

import './BcToast.scss';
import config from '../../config';

const BcToast = () => {
  const bcprocessor = new BcProcessorService();

  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  const [isElementOpen, setElementOpen] = React.useState(false);
  const toggleElement = () => setElementOpen(!isElementOpen);

  const pendingLength = () => {
    return bcprocessor.getTxPendingList(
      currentUser.attributes['custom:account_address'],
    ).length;
  };

  const renderList = () => {
    return bcprocessor
      .getTxList(currentUser.attributes['custom:account_address'])
      .slice(-3)
      .reverse()
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
                  onClick={toggleElement}
                >
                  Check on Etherscan
                </a>
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
      <Fragment>
        <div
          className={isElementOpen ? 'Backdrop__Open' : 'Backdrop'}
          onClick={toggleElement}
        />
        <div className="Processor">
          {currentWallet.state === WalletStatuses.Deployed ? (
          <button className="Processor__Button" onClick={toggleElement}>
            {pendingLength() ? (
              <IconProcessing />
            ) : (
              <div className="BcStatic">
                <div className="BcStatic__Inner" />
              </div>
            )}
          </button>
          ):(
            <Link className="Processor__Button" to="/account">
              <div className="BcStatic">
                <div className="BcStatic__Inner WarningIcon" />
              </div>
            </Link>
          )}
          <div className={isElementOpen ? 'Dropdown__Open' : 'Dropdown'}>
            <div className="Toast">
              {renderList()}
              <div className="Dropdown__Footer">
                <Link to="/account" onClick={toggleElement}>
                  View all transactions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  );
};

export default BcToast;
