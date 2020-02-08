import React, { useContext } from 'react';
import Web3Connect from 'web3connect';

import { DaoServiceContext, Web3ConnectContext } from '../../contexts/Store';
import config from '../../config';
import { getChainData } from '../../utils/chains';
import { w3connect, providerOptions } from '../../utils/Auth';

export const Web3SignIn = ({ history }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [, setWeb3Connect] = useContext(Web3ConnectContext);

  return (
    <button
      onClick={async () => {
        const web3Connect = new Web3Connect.Core({
          network: getChainData(config.CHAIN_ID).network, // optional
          providerOptions, // required
          cacheProvider: true,
        });

        await w3connect(web3Connect);
        setWeb3Connect(web3Connect);
        history.push(
          '/dao/' + daoService.daoAddress.toLowerCase() + '/proposals',
        );
        window.location.reload();
      }}
    >
      Sign In With Web3
    </button>
  );
};
