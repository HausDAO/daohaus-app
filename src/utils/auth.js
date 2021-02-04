import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import Portis from '@portis/web3';

import { USER_TYPE } from './dao-service';
import { getChainDataByName, supportedChains } from './chains';

export const setWeb3Connect = async (chainData) => {
  const web3Connect = {
    w3c: new Web3Modal({
      network: chainData.network,
      providerOptions: providerOptions(chainData),
      cacheProvider: true,
      theme: 'dark',
    }),
  };
  const provider = await web3Connect.w3c.connect();
  const web3 = new Web3(provider);
  const w3c = web3Connect.w3c;
  return { w3c, web3, provider };
};

export const providerOptions = (chainData) => {
  const providers = chainData.providers;

  const allNetworkProviders = {};

  if (providers.includes('walletconnect')) {
    const rpcUrl =
      chainData.network_id === 100
        ? 'https://dai.poa.network '
        : `https://${chainData.network}.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
    allNetworkProviders.walletconnect = {
      network: chainData.network,
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_KEY,
        rpc: {
          [chainData.network_id]: rpcUrl,
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
  let provider = await web3Connect.w3c.connect();
  let web3 = new Web3(provider);
  const injectedChainId = await web3.eth.getChainId();

  if (!supportedChains[injectedChainId]) {
    // eslint-disable-next-line no-throw-literal
    throw {
      msg: `DAOhaus doesn't support the detected network id: ${injectedChainId}, Please switch to Mainnet, Xdai, Kovan or Rinkeby`,
      error: new Error(`Injected web3 chainId: ${injectedChainId}`),
    };
  }

  if (currentNetwork && currentNetwork.network_id !== injectedChainId) {
    // eslint-disable-next-line no-throw-literal
    throw {
      msg: `This DAO is on ${currentNetwork.network}, Please switch your network.`,
      error: new Error(`Injected web3 chainId: ${injectedChainId}`),
    };
  }

  console.log('web3Connect.w3c', web3Connect.w3c);

  const w3cNetwork = getChainDataByName(
    web3Connect.w3c.providerController.network,
  );
  const mismatchSupportedNetwork = injectedChainId !== w3cNetwork.network_id;

  if (mismatchSupportedNetwork) {
    const injectedNetwork = supportedChains[injectedChainId];

    web3Connect = {
      w3c: new Web3Modal({
        network: injectedNetwork.network,
        providerOptions: providerOptions(injectedNetwork),
        cacheProvider: true,
        theme: 'dark',
      }),
    };
    provider = await web3Connect.w3c.connect();
    web3 = new Web3(provider);
  }

  const w3c = web3Connect.w3c;
  return { w3c, web3, provider };
};

export const createWeb3User = (accountAddress) => {
  return {
    type: USER_TYPE.WEB3,
    username: accountAddress,
  };
};
