import React, { useContext } from 'react';
import Web3Modal from 'web3modal';

import { DaoServiceContext, Web3ConnectContext } from '../../contexts/Store';
import config from '../../config';
import { getChainData } from '../../utils/chains';
import { w3connect, providerOptions } from '../../utils/Auth';

import { ButtonPrimary } from '../../App.styles.js';

export const Web3SignIn = ({ history }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [, setWeb3Connect] = useContext(Web3ConnectContext);

  return (
    <ButtonPrimary
      onClick={async () => {
        const web3Connect = new Web3Modal({
          network: getChainData(config.CHAIN_ID).network, // optional
          providerOptions, // required
          cacheProvider: true,
        });

        try {
          await w3connect(web3Connect);
          setWeb3Connect(web3Connect);
          history.push(
            '/dao/' + daoService.daoAddress.toLowerCase() + '/proposals',
          );
          window.location.reload();
        } catch (err) {
          console.log('web3Connect error', err);
        }
      }}
    >
      {' '}
      Sign In With Web3
    </ButtonPrimary>
  );
};
