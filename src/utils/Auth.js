import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { USER_TYPE } from './DaoService';
import { getChainData } from './chains';

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_URI.split('/').pop(),
    },
  },
};

export const w3connect = async (web3Connect) => {
  const provider = await web3Connect.w3c.connect();

  const web3 = new Web3(provider);

  const injectedChainId = await web3.eth.getChainId();

  if (+injectedChainId !== +process.env.REACT_APP_NETWORK_ID) {
    alert(
      `Please switch Web3 to the correct network and try signing in again. Detected network: ${
        getChainData(injectedChainId).network
      }, Required network: ${
        getChainData(process.env.REACT_APP_NETWORK_ID).network
      }`,
    );
    throw new Error(
      `Injected web3 chainId: ${injectedChainId}, config: ${process.env.REACT_APP_NETWORK_ID}`,
    );
  }
  // console.log('w3connect', web3Connect);
  const w3c = web3Connect.w3c;
  return { w3c, web3, provider };
};

export const createWeb3User = (accountAddress) => {
  return {
    type: USER_TYPE.WEB3,
    attributes: { 'custom:account_address': accountAddress.toLowerCase() },
    username: accountAddress,
  };
};
