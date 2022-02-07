import WalletConnectProvider from '@walletconnect/web3-provider';

import { chainByID, chainByNetworkId } from './chain';

const isInjected = () => window.ethereum?.chainId;

export const attemptInjectedChainData = () => {
  return isInjected() ? chainByID(window.ethereum.chainId) : chainByID('0x1');
};

const addNetworkProviders = chainData => {
  const allProviders = {};
  if (!chainData) {
    // this will fire if window.ethererum exists, but the user is on the wrong chain
    return false;
  }
  const providersToAdd = chainData.providers;
  if (providersToAdd.includes('walletconnect')) {
    allProviders.walletconnect = {
      network: chainData.network,
      package: WalletConnectProvider,
      options: {
        // infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
        rpc: {
          1: `https://${process.env.REACT_APP_RPC_URI}.eth.rpc.rivet.cloud/`,
          4: `https://${process.env.REACT_APP_RPC_URI}.rinkeby.rpc.rivet.cloud/`,
          42: `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
          100: 'https://rpc.gnosischain.com/',
          137: 'https://polygon-rpc.com/',
          42161: 'https://arb1.arbitrum.io/rpc',
          42220: 'https://forno.celo.org',
        },
      },
    };
  }
  // if (providersToAdd.includes('portis')) {
  //   allProviders.portis = {
  //     package: Portis,
  //     options: {
  //       id: process.env.REACT_APP_PORTIS_ID || '',
  //     },
  //   };
  // }
  // if (providersToAdd.includes('fortmatic')) {
  //   allProviders.fortmatic = {
  //     package: Fortmatic, // required
  //     options: {
  //       key: process.env.REACT_APP_FORTMATIC_KEY || '', // required
  //     },
  //   };
  // }
  return allProviders;
};

export const getProviderOptions = () =>
  addNetworkProviders(attemptInjectedChainData());

export const deriveChainId = provider => {
  if (provider.isMetaMask) {
    return provider.chainId;
  }
  if (provider.wc) {
    return chainByNetworkId(provider.chainId).chain_id;
  }
  if (provider.safe) {
    return chainByNetworkId(provider.safe.chainId).chain_id;
  }
  // else if (provider.isPortis) {
  //   return chainByNetworkId(provider._portis.config.network.chainId).chain_id;
  // }
  return '0x1';
};

export const deriveSelectedAddress = provider => {
  if (provider.isMetaMask) {
    return provider.selectedAddress;
  }
  if (provider.wc) {
    return provider.accounts[0];
  }
  if (provider.safe) {
    return provider.safe.safeAddress;
  }
  // else if (provider.isPortis) {
  //   return provider._portis._selectedAddress;
  // }
  return '0x';
};
