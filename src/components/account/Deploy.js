import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { CurrentWalletContext, DaoServiceContext } from '../../contexts/Store';
import Loading from '../shared/Loading';

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
            onClick={async () => {
              try {
                await daoService.mcDao.deployAccount();
                setloading(true);
              } catch (err) {
                console.error(err);
              }
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
