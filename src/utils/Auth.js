import {
  getSdkEnvironment,
  SdkEnvironmentNames,
  createSdk,
} from '@archanova/sdk';
import { Auth } from 'aws-amplify';

import config from '../config';
import { USER_TYPE } from './DaoService';

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

export const signInWithWeb3 = async () => {
  const [account] = await window.ethereum.enable();
  const injectedChainId = parseInt(window.ethereum.chainId);
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

  window.ethereum.on('chainChanged', () => {
    document.location.reload();
  });

  window.ethereum.autoRefreshOnNetworkChange = true;
  return createWeb3User(account);
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
  return { ...realuser, ...{ sdk } };
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
