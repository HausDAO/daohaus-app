import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { CurrentWalletContext, DaoServiceContext } from '../../contexts/Store';
import Loading from '../shared/Loading';

<<<<<<< HEAD
=======
import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';

import { sdkConstants } from '@archanova/sdk';

const gasPriceStrategy = sdkConstants.GasPriceStrategies.Fast;

>>>>>>> 12233a60a8353d56ab3f3a325430391a8e72bd08
const Deploy = (props) => {
  const [daoService] = useContext(DaoServiceContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [loading, setloading] = useState(false);

  return (
    <>
      {loading && currentWallet.state !== 'Deployed' && <Loading />}
      {currentWallet.state !== 'Deployed' &&
        currentWallet.state !== 'Not Connected' &&
        currentWallet.nextState !== 'Deployed' &&
        !loading && (
          <button
<<<<<<< HEAD
            onClick={async () => {
              try {
                await daoService.mcDao.deployAccount();
                setloading(true);
              } catch (err) {
                console.error(err);
              }
=======
            onClick={() => {
              const sdk = currentUser.sdk;
              const bcprocessor = new BcProcessorService();

              sdk
                .estimateAccountDeployment(gasPriceStrategy)
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
>>>>>>> 12233a60a8353d56ab3f3a325430391a8e72bd08
            }}
          >
            Deploy
          </button>
        )}
      {currentWallet.state === 'Deployed' && (
        <h2>Success! Your account is ready.</h2>
      )}
    </>
  );
};

export default withRouter(Deploy);
