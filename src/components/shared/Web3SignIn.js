import React, { useContext } from 'react';
import Web3Modal from 'web3modal';
import { Button, useToast } from '@chakra-ui/core';

import { getChainData } from '../../utils/chains';
import { w3connect, providerOptions } from '../../utils/Auth';
import { PokemolContext } from '../../contexts/PokemolContext';

export const Web3SignIn = () => {
  const { state, dispatch } = useContext(PokemolContext);
  const toast = useToast();

  console.log('state', state);

  return (
    <>
      <Button
        onClick={async () => {
          const _web3Connect = {
            w3c: new Web3Modal({
              network: getChainData(+process.env.REACT_APP_NETWORK_ID).network,
              providerOptions,
              cacheProvider: true,
            }),
          };

          try {
            const { w3c, web3, provider } = await w3connect(_web3Connect);
            dispatch({ type: 'setWeb3', payload: { w3c, web3, provider } });
            // window.location.reload();
          } catch (err) {
            console.log('web3Connect error', err);

            toast({
              title: 'Wrong Network',
              position: 'top-right',
              description: err.msg,
              status: 'warning',
              duration: 9000,
              isClosable: true,
            });
          }
        }}
      >
        {' '}
        Sign In With Web3
      </Button>
    </>
  );
};
