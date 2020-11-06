import Web3 from 'web3';
import { ethers } from 'ethers';

export class EnsService {
  provider;

  constructor() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_URI),
    );

    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    this.provider = provider;
  }
}
