import React, { useContext } from 'react';
import Web3Modal from 'web3modal';
import { Button } from '@chakra-ui/core';

import { getChainData } from '../../utils/chains';
import { w3connect, providerOptions } from '../../utils/Auth';

import { useHistory } from 'react-router-dom';

export const Web3SignIn = () => {
  const history = useHistory();
  // const [daoService] = useContext(DaoServiceContext);
  // const [, setWeb3Connect] = useContext(Web3ConnectContext);
  // const [, setHasAlert] = useContext(ModalContext);

  return (
    <Button
      onClick={async () => {
        const _web3Connect = {
          w3c: new Web3Modal({
            network: getChainData(+process.env.REACT_APP_NETWORK_ID).network, // optional
            providerOptions, // required
            cacheProvider: true,
          }),
        };

        try {
          const { w3c, web3, provider } = await w3connect(_web3Connect);
          // setWeb3Connect({ w3c, web3, provider });
          // history.push(
          //   '/dao/' + daoService.daoAddress.toLowerCase() + '/proposals',
          // );
          window.location.reload();
        } catch (err) {
          console.log('web3Connect error', err);
          // setHasAlert({
          //   modal: 'alertMessage',
          //   title: 'Wrong Network',
          //   msg: err.msg,
          // });
        }
      }}
    >
      {' '}
      Sign In With Web3
    </Button>
  );
};
