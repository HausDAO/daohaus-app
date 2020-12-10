import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import Portis from '@portis/web3';

import { USER_TYPE } from './dao-service';
import { getChainData } from './chains';

export const providerOptions = () => {
  const providers = getChainData(+process.env.REACT_APP_NETWORK_ID).providers;
  const allNetworkProviders = {};

  if (providers.includes('walletconnect')) {
    allNetworkProviders.walletconnect = {
      network: getChainData(process.env.REACT_APP_NETWORK_ID).network,
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_RPC_URI.split('/').pop(),
        rpc: {
          [process.env.REACT_APP_NETWORK_ID]: process.env.REACT_APP_RPC_URI,
        },
      },
    };
  }

  if (providers.includes('portis')) {
    allNetworkProviders.portis = {
      package: Portis, // required
      options: {
        id: process.env.REACT_APP_PORTIS_ID || '', // required
      },
    };
  }

  if (providers.includes('fortmatic')) {
    allNetworkProviders.fortmatic = {
      package: Fortmatic, // required
      options: {
        key: process.env.REACT_APP_FORTMATIC_KEY || '', // required
      },
    };
  }

  return allNetworkProviders;
};

export const w3connect = async (web3Connect, currentNetwork) => {
  const provider = await web3Connect.w3c.connect();

  const web3 = new Web3(provider);

  const injectedChainId = await web3.eth.getChainId();
  console.log('injectedChainId', injectedChainId);

  // don't care about this if on hub, only if in dao

  console.log('logging the user in, dao/hub network', currentNetwork);
  // if (+injectedChainId !== +process.env.REACT_APP_NETWORK_ID) {
  if (currentNetwork && +injectedChainId !== currentNetwork.network_id) {
    // eslint-disable-next-line no-throw-literal
    throw {
      msg: `Please switch Web3 to the correct network and try signing in again. Detected network: ${
        getChainData(injectedChainId).network
      }, Required network: ${
        getChainData(process.env.REACT_APP_NETWORK_ID).network
      }`,
      error: new Error(
        `Injected web3 chainId: ${injectedChainId}, config: ${process.env.REACT_APP_NETWORK_ID}`,
      ),
    };
  }
  // console.log('w3connect', web3Connect);
  const w3c = web3Connect.w3c;
  return { w3c, web3, provider };
};

export const createWeb3User = (accountAddress) => {
  return {
    type: USER_TYPE.WEB3,
    username: accountAddress,
  };
};
