import Web3 from 'web3';

let singleton;

export default class Web3Service {
  // make singleton
  static create(useInjected) {
    if (!singleton) {
      singleton = new Web3Service(useInjected);
    }
    return singleton;
  }

  constructor(injected) {
    if (injected) {
      this.web3 = new Web3(injected);
      console.log('web3service injected');
    } else {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_URI),
      );
    }
  }

  async latestBlock() {
    return this.web3.eth.getBlock('latest');
  }

  fromWei(amount) {
    if (!amount) {
      return 0;
    }

    return this.web3.utils.fromWei(amount.toString(), 'ether');
  }

  toWei(amount) {
    return this.web3.utils.toWei(amount.toString(), 'ether');
  }

  toUtf8(hexString) {
    return this.web3.utils.hexToUtf8(hexString);
  }

  toNumber(num) {
    return num.toNumber();
  }

  getTransaction(hash) {
    return this.web3.eth.getTransaction(hash);
  }

  initContract(abi, addr) {
    return new this.web3.eth.Contract(abi, addr);
  }

  getBalance(addr) {
    return this.web3.eth.getBalance(addr);
  }

  getTime(block) {
    return this.web3.eth.getBlock(block).timestamp;
  }
}
