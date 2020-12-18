import Web3 from 'web3';

import {
  Web3MolochService,
  Web3MolochServiceV2,
  ReadonlyMolochService,
} from './moloch-service';
import { Web3TokenService, TokenService } from './token-service';

let singleton;

export const USER_TYPE = {
  WEB3: 'web3',
  READ_ONLY: 'readonly',
};

export class DaoService {
  accountAddr;
  web3;
  mcDao;
  token;
  daoAddress;

  constructor(accountAddr, web3, molochService, token, contractAddr) {
    this.accountAddr = accountAddr;
    this.web3 = web3;
    this.moloch = molochService;
    this.token = token;
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
    // const rpcUrl =
    //   daoNetwork.network_id === 100
    //     ? 'https://dai.poa.network '
    //     : `https://${daoNetwork.network}.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
    // const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    const web3 = new Web3(injected);

    // console.log('instantiateWithWeb3, web3', web3, daoNetwork, version);

    // let moloch;
    // let approvedToken;
    // if (+version === 2) {
    console.log('new Web3MolochServiceV2', web3);
    const moloch = new Web3MolochServiceV2(
      web3,
      contractAddr,
      accountAddr,
      +version,
    );
    const approvedToken = await moloch.getDepositToken();

    console.log('approvedToken', approvedToken);
    // } else {
    //   moloch = new Web3MolochService(web3, contractAddr, accountAddr, version);
    //   approvedToken = await moloch.approvedToken();
    // }

    const token = new Web3TokenService(
      web3,
      approvedToken,
      contractAddr,
      accountAddr,
    );

    singleton = new Web3DaoService(accountAddr, web3, moloch, token);
    return singleton;
  }

  static async instantiateWithReadOnly(contractAddr, version, network) {
    console.log('daoservice instantiateWithReadOnly');

    const rpcUrl =
      network.network_id === 100
        ? 'https://dai.poa.network '
        : `https://${network.network}.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;

    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    const moloch = new ReadonlyMolochService(web3, contractAddr, '', version);

    let approvedToken;
    if (version === 2) {
      approvedToken = await moloch.getDepositToken();
    } else {
      approvedToken = await moloch.approvedToken();
    }
    const token = new TokenService(web3, approvedToken);
    singleton = new ReadonlyDaoService('', web3, moloch, token, contractAddr);
    return singleton;
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
}

export class Web3DaoService extends DaoService {
  userType = USER_TYPE.WEB3;

  async getAccountWei() {
    const ethWei = await this.web3.eth.getBalance(this.accountAddr);
    return ethWei;
  }
}
