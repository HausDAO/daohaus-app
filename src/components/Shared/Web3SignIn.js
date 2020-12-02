import React from 'react';
import Web3Modal from 'web3modal';
import { useToast, Button } from '@chakra-ui/react';

import { getChainData } from '../../utils/chains';
import { w3connect, providerOptions } from '../../utils/auth';
import { useWeb3Connect } from '../../contexts/PokemolContext';

export const Web3SignIn = () => {
  const [, updateWeb3Connect] = useWeb3Connect();
  const toast = useToast();

  return (
    <>
      <Button
        onClick={async () => {
          const _web3Connect = {
            w3c: new Web3Modal({
              network: getChainData(+process.env.REACT_APP_NETWORK_ID).network,
              providerOptions: providerOptions(),
              cacheProvider: false,
              theme: 'dark',
            }),
          };
          console.log(_web3Connect);
          try {
            const { w3c, web3, provider } = await w3connect(_web3Connect);
            updateWeb3Connect({ w3c, web3, provider });

            // window.location.reload();
          } catch (err) {
            console.log('web3Connect error', err);

            toast({
              title: 'Wrong Network',
              position: 'top-right',
              description: err?.msg || "Couldn't connect to injected network",
              status: 'warning',
              duration: 9000,
              isClosable: true,
            });
          }
        }}
      >
        {' '}
        Connect
      </Button>
    </>
  );
};
