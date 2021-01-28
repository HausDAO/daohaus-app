import React from 'react';
import { Button } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
// import Web3 from 'web3';

// import { w3connect } from '../../utils/auth';
// import { useNetwork, useWeb3Connect } from '../../contexts/PokemolContext';

export const Web3SignIn = () => {
  // const [web3Connect, updateWeb3Connect] = useWeb3Connect();
  // const [network] = useNetwork();
  // const toast = useToast();
  const { requestWallet } = useInjectedProvider();

  return (
    <>
      <Button
        onClick={requestWallet}
        // onClick={async () => {
        //   try {
        //     const forceUserInit = true;
        //     const { w3c, web3, provider } = await w3connect(
        //       web3Connect,
        //       network,
        //     );
        //     updateWeb3Connect({ w3c, web3, provider, forceUserInit });
        //   } catch (err) {
        //     console.log('web3Connect error', err);

        //     toast({
        //       title: 'Wrong Network',
        //       position: 'top-right',
        //       description: err?.msg || "Couldn't connect to injected network",
        //       status: 'warning',
        //       duration: 9000,
        //       isClosable: true,
        //     });
        //   }
        // }}
      >
        {' '}
        Connect
      </Button>
    </>
  );
};

export default Web3SignIn;
