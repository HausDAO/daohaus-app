import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';

import BcProcessorService from '../../utils/BcProcessorService';
import Web3Service from '../../utils/Web3Service';
import { ethToWei } from '@netgum/utils'; // returns BN

import Loading from '../shared/Loading';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';

const Deploy = (props) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [loading, setloading] = useState(false);

  const web3Service = new Web3Service();

  return (
    <>
      {loading && currentWallet.state !== 'Deployed' && <Loading />}
      {currentWallet.state !== 'Deployed' &&
        currentWallet.state !== 'Not Connected' &&
        currentWallet.nextState !== 'Deployed' &&
        !loading && (
          <button
            onClick={() => {
              const sdk = currentUser.sdk;
              const bcprocessor = new BcProcessorService();

              sdk
                .estimateAccountDeployment()
                .then((estimated) => {
                  // console.log(estimated);
                  if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
                    alert(
                      `you need more gas, at least: ${web3Service.fromWei(
                        estimated.totalCost.toString(),
                      )}`,
                    );

                    return false;
                  }
                  sdk
                    .deployAccount(estimated)
                    .then((data) => {
                      // console.log('deployed', data);
                      setloading(true);
                      bcprocessor.setTx(
                        data,
                        currentUser.attributes['custom:account_address'],
                        'Deploy contract wallet.',
                        true,
                      );
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            }}
          >
            Deploy
          </button>
        )}
      {currentWallet.state === 'Deployed' && (
        <h2>Successfully Deployed</h2>
      )}
    </>
  );
};

export default withRouter(Deploy);
