import abi from '../contracts/transmutation.json';

export const setupValuesDefault = {
  giveToken: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  getToken: '0x33f2f65d7f919e802f0ac2637b0da6ddbf8fd346',
  id: '0x40a8a7c0e7cc73c423df5fadea624b37d623100a',
  minion: '0x3c71c0ed94f6c8e56808395c0e8233733eb38249',
  moloch: '0x501f352e32ec0c981268dc5b5ba1d3661b1acbc6',
  transmutation: '0x88988891c990f25c650e13b84104980883342f99',
  trust: '0x93c7a856172103ece529016f73fa625de8c5acc9',
  exchangeRate: 0.5,
  paddingNumber: 10000,
  burnRate: 0.25,
  minCap: 1,
  maxCap: 2.5,
  contributionRoundPerc: 0.1,
  githubRepo: 'https://github.com/HausDAO',
};

export class TransmutationService {
  web3;
  contract;
  daoAddress;
  accountAddress;
  setupValues;

  constructor(web3, accountAddress, setupValues, bcProcessor = null) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(abi, setupValues.transmutation);
    this.accountAddress = accountAddress;
    this.setupValues = setupValues;
    this.bcProcessor = bcProcessor;
  }

  calcTribute(paymentRequested) {
    if (!paymentRequested || isNaN(paymentRequested)) {
      return '0';
    }
    const bnExchange = this.web3.utils.toBN(
      this.setupValues.exchangeRate * this.setupValues.paddingNumber,
    );

    const bnTributeOffered = this.web3.utils.toBN(
      this.web3.utils.toWei('' + paymentRequested),
    );
    const tributeOffered = bnTributeOffered
      .mul(bnExchange)
      .div(this.web3.utils.toBN(this.setupValues.paddingNumber));

    return tributeOffered;
  }

  async giveToken() {
    return this.contract.methods.giveToken().call();
  }

  async getToken() {
    return this.contract.methods.getToken().call();
  }

  async propose(applicant, paymentRequested, description) {
    console.log(
      applicant,
      this.calcTribute(paymentRequested),
      this.web3.utils.toWei('' + paymentRequested),
      description,
      this.accountAddress,
    );
    const txReceipt = await this.contract.methods
      .propose(
        applicant,
        this.calcTribute(paymentRequested),
        this.web3.utils.toWei('' + paymentRequested),
        description,
      )
      .send({ from: this.accountAddress });
    if (this.bcProcessor) {
      this.bcProcessor.setTx(
        txReceipt.transactionHash,
        this.accountAddress,
        `Transmutate ${this.calcTribute(paymentRequested)} Tokens`,
        true,
      );
    }

    return txReceipt.transactionHash;
  }
}
