import Web3 from 'web3';

import {
  Web3McDaoService,
  Web3McDaoServiceV2,
  ReadonlyMcDaoService,
} from './McDaoService';
import {
  BcProcessorService,
  ReadOnlyBcProcessorService,
} from './BcProcessorService';
import { Web3TokenService, TokenService } from './TokenService';
import config from '../config';
import { WalletStatuses } from './WalletStatus';

let singleton;

export const USER_TYPE = {
  WEB3: 'web3',
  // SDK: 'sdk',
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

  static async instantiateWithWeb3(
    accountAddr,
    injected,
    contractAddr,
    version,
  ) {
    const web3 = new Web3(injected);
    const bcProcessor = new BcProcessorService(web3);

    let mcDao;
    let approvedToken;
    if (version === 2) {
      mcDao = new Web3McDaoServiceV2(
        web3,
        contractAddr,
        accountAddr,
        bcProcessor,
        version,
      );
      approvedToken = await mcDao.getDepositToken();
    } else {
      mcDao = new Web3McDaoService(
        web3,
        contractAddr,
        accountAddr,
        bcProcessor,
        version,
      );
      approvedToken = await mcDao.approvedToken();
    }

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

  static async instantiateWithReadOnly(contractAddr, version) {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));
    const bcProcessor = new ReadOnlyBcProcessorService(web3);

    const mcDao = new ReadonlyMcDaoService(web3, contractAddr, '', version);

    let approvedToken;
    if (version === 2) {
      approvedToken = await mcDao.getDepositToken();
    } else {
      approvedToken = await mcDao.approvedToken();
    }
    // TODO: is this needed?
    const token = new TokenService(web3, approvedToken);

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
