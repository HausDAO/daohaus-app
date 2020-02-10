import {
  getSdkEnvironment,
  SdkEnvironmentNames,
  createSdk,
} from '@archanova/sdk';
import { Auth } from 'aws-amplify';
import Web3 from 'web3';
import Web3Connect from 'web3connect';
import WalletConnectProvider from '@walletconnect/web3-provider';

import config from '../config';
import { USER_TYPE } from './DaoService';
import { getChainData } from './chains';

const getChainIdName = (chainId) => {
  switch (chainId) {
    case 1:
      return 'Mainnet';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 5:
      return 'Goerli';
    case 42:
      return 'Kovan';
    case 4447:
      return 'Ganache';
    default:
      return 'Unknown';
  }
};

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: config.INFURA_URI.split('/').pop(),
    },
  },
};

export const w3connect = async (web3Connect) => {
  const provider = await web3Connect.connect();

  const web3 = new Web3(provider);

  const injectedChainId = await web3.eth.getChainId();

  if (injectedChainId !== config.CHAIN_ID) {
    alert(
      `Please switch Web3 to the correct network and try signing in again. Detected network: ${
        getChainData(injectedChainId).network
      }, Required network: ${getChainData(config.CHAIN_ID).network}`,
    );
    throw new Error(
      `Injected web3 chainId: ${injectedChainId}, config: ${config.CHAIN_ID}`,
    );
  }

  return { web3Connect, web3, provider };
};

export const signInWithWeb3 = async () => {
  // const infuraId = config.INFURA_URI.split('/').pop();

  console.log('config.CHAIN_ID: ', config.CHAIN_ID);
  const web3Connect = new Web3Connect.Core({
    network: getChainData(config.CHAIN_ID).network, // optional
    providerOptions, // required
  });
  console.log('web3Connect: ', web3Connect);

  const provider = await web3Connect.connect();
  console.log('provider: ', provider);

  const web3 = new Web3(provider);
  console.log('web3: ', web3);

  const injectedChainId = await web3.eth.getChainId();
  console.log('injectedChainId: ', injectedChainId);

  const [account] = await web3.eth.getAccounts();
  console.log('account: ', account);

  if (injectedChainId !== config.CHAIN_ID) {
    alert(
      `Please switch Web3 to the correct network and try signing in again. Detected network: ${getChainIdName(
        injectedChainId,
      )}, Required network: ${getChainIdName(config.CHAIN_ID)}`,
    );
    throw new Error(
      `Injected web3 chainId: ${injectedChainId}, config: ${config.CHAIN_ID}`,
    );
  }

  return { user: createWeb3User(account), provider };
};

export const signInWithSdk = async () => {
  // check if user is authenticated
  // try will throw if not
  const user = await Auth.currentAuthenticatedUser();
  // attributes are only updated here until re-auth
  // so grab attributes from here
  const attributes = await Auth.currentUserInfo();

  const realuser = createSdkUser(user, attributes);

  // attach sdk
  // console.log("in load: realuser", realuser);
  const sdkEnv = getSdkEnvironment(SdkEnvironmentNames[`${config.SDK_ENV}`]);
  // check or set up local storage and initialize sdk connection
  const sdk = new createSdk(sdkEnv.setConfig('storageAdapter', localStorage));
  await sdk.initialize();
  // check if account is connected in local storage

  const accounts = await sdk.getConnectedAccounts();
  // if the there is an account connect it
  // this should never not exsist, it is added to AWS on first signin
  if (accounts.items.length) {
    await sdk.connectAccount(realuser.attributes['custom:account_address']);
  }
  // store sdk instance (needed?)
  // setUserSdk(sdk);
  // add sdk instance to current user
  return { user: { ...realuser, ...{ sdk } } };
};

export const createWeb3User = (accountAddress) => {
  return {
    type: USER_TYPE.WEB3,
    attributes: { 'custom:account_address': accountAddress },
    username: accountAddress,
  };
};

export const createSdkUser = (user, attributes) => {
  return {
    ...user,
    ...{ attributes: attributes.attributes },
    type: USER_TYPE.SDK,
  };
};
