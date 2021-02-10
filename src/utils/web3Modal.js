import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import Portis from '@portis/web3';

import { chainByID } from './chain';

const isInjected = () => !!window.ethereum?.chainId;

export const attemptInjectedChainData = () =>
  isInjected() ? chainByID(window.ethereum.chainId) : chainByID('0x1');

const addNetworkProviders = (chainData) => {
  const allProviders = {};
  const providersToAdd = chainData.providers;

  if (providersToAdd.includes('walletconnect')) {
    allProviders.walletconnect = {
      network: chainData.network,
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
        rpc: chainData.rpc_url,
      },
    };
  }
  if (providersToAdd.includes('portis')) {
    allProviders.portis = {
      package: Portis,
      options: {
        id: process.env.REACT_APP_PORTIS_ID || '',
      },
    };
  }
  if (providersToAdd.includes('fortmatic')) {
    allProviders.fortmatic = {
      package: Fortmatic, // required
      options: {
        key: process.env.REACT_APP_FORTMATIC_KEY || '', // required
      },
    };
  }
  return allProviders;
};

export const getProviderOptions = () =>
  addNetworkProviders(attemptInjectedChainData());
