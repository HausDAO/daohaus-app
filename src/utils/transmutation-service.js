import abi from '../contracts/transmutation.json';

export class TransmutationService {
  web3;
  contract;
  daoAddress;
  accountAddress;
  setupValues;

  constructor(web3, accountAddress, setupValues) {
    this.web3 = web3;
    console.log(setupValues);
    this.contract = new web3.eth.Contract(abi, setupValues.transmutation);
    this.accountAddress = accountAddress;
    this.setupValues = setupValues;
  }

  // internal
  sendTx(options, callback) {
    const { from, name, params } = options;
    const tx = this.contract.methods[name](...params);
    console.log('this.accountAddr', from);
    return tx
      .send({ from: from })
      .on('transactionHash', (txHash) => {
        callback(txHash, options);
      })
      .on('error', (error) => {
        callback(null, error);
      });
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

  async propose(applicant, paymentRequested, description, callback) {
    console.log(
      applicant,
      this.calcTribute(paymentRequested),
      this.web3.utils.toWei('' + paymentRequested),
      description,
      this.accountAddress,
    );
    const txReceipt = await this.sendTx(
      {
        from: this.accountAddress,
        name: 'propose',
        params: [
          applicant,
          this.calcTribute(paymentRequested),
          this.web3.utils.toWei('' + paymentRequested),
          description,
        ],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }
}
