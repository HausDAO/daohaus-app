import Web3 from 'web3';

import {
  SdkMcDaoService,
  Web3McDaoService,
  ReadonlyMcDaoService,
} from './McDaoService';
import {
  BcProcessorService,
  ReadOnlyBcProcessorService,
} from './BcProcessorService';
import { Web3TokenService, SdkTokenService } from './TokenService';
import config from '../config';
import { WalletStatuses } from './WalletStatus';
import SdkService from './SdkService';

let singleton;

export const USER_TYPE = {
  WEB3: 'web3',
  SDK: 'sdk',
  READ_ONLY: 'readonly',
};

export class DaoService {
  bcProcessor;
  accountAddr;
  web3;
  mcDao;
  token;
  daoAddress;

  constructor(
    accountAddr,
    web3,
    mcDaoService,
    token,
    bcProcessor,
    contractAddr,
  ) {
    this.accountAddr = accountAddr;
    this.web3 = web3;
    this.mcDao = mcDaoService;
    this.token = token;
    this.bcProcessor = bcProcessor;
    this.daoAddress = contractAddr;
  }

  static retrieve() {
    return singleton || undefined;
  }

  static async instantiateWithWeb3(accountAddr, injected, contractAddr) {
    const web3 = new Web3(injected);
    const bcProcessor = new BcProcessorService(web3);
    const mcDao = new Web3McDaoService(
      web3,
      contractAddr,
      accountAddr,
      bcProcessor,
    );
    const approvedToken = await mcDao.approvedToken();
    const token = new Web3TokenService(
      web3,
      approvedToken,
      contractAddr,
      accountAddr,
      bcProcessor,
    );
    singleton = new Web3DaoService(
      accountAddr,
      web3,
      mcDao,
      token,
      bcProcessor,
    );
    return singleton;
  }

  static async instantiateWithSDK(accountAddr, sdk, contractAddr) {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));
    const sdkService = new SdkService(sdk);
    const bcProcessor = new BcProcessorService(web3);
    const mcDao = new SdkMcDaoService(
      web3,
      contractAddr,
      accountAddr,
      bcProcessor,
      sdkService,
    );
    const approvedToken = await mcDao.approvedToken();
    const token = new SdkTokenService(
      web3,
      approvedToken,
      contractAddr,
      accountAddr,
      bcProcessor,
      sdkService,
    );
    singleton = new SdkDaoService(
      accountAddr,
      web3,
      mcDao,
      token,
      bcProcessor,
      sdkService,
    );
    return singleton;
  }

  static async instantiateWithReadOnly(contractAddr) {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));
    const bcProcessor = new ReadOnlyBcProcessorService(web3);
    const mcDao = new ReadonlyMcDaoService(web3, contractAddr, '');

    const approvedToken = await mcDao.approvedToken();
    const token = new SdkTokenService(web3, approvedToken);
    singleton = new ReadonlyDaoService(
      '',
      web3,
      mcDao,
      token,
      bcProcessor,
      contractAddr,
    );
    return singleton;
  }

  async getAccountWei() {
    throw new Error(`Not implemented by subclass.`);
  }

  async getAccountState() {
    throw new Error(`Not implemented by subclass.`);
  }

  async getAccountEth() {
    const wei = await this.getAccountWei();
    return this.web3.utils.fromWei(wei);
  }
}

export class ReadonlyDaoService extends DaoService {
  userType = USER_TYPE.READ_ONLY;

  async getAccountWei() {
    return '0';
  }

  getAccountState() {
    return WalletStatuses.NotConnected;
  }
}

export class Web3DaoService extends DaoService {
  userType = USER_TYPE.WEB3;

  async getAccountWei() {
    const ethWei = await this.web3.eth.getBalance(this.accountAddr);
    return ethWei;
  }

  getAccountState() {
    return WalletStatuses.Connected;
  }
}

export class SdkDaoService extends DaoService {
  userType = USER_TYPE.SDK;
  sdkService;

  constructor(
    accountAddr,
    web3,
    mcDaoService,
    token,
    bcProcessorService,
    sdkService,
  ) {
    super(accountAddr, web3, mcDaoService, token, bcProcessorService);
    this.sdkService = sdkService;
  }

  async getAccountWei() {
    const ethWei = this.sdkService.getWeiBalance();
    return ethWei;
  }

  getAccountState() {
    return this.sdkService.getAccountState();
  }
}
