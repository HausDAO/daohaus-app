import abi from '../contracts/transmutation.json';

export const setupValues = {
  contractAddress: '0x8fB2cEa12c43573616be80148C182fCA14Eb9a26',
  exchangeRate: 0.5,
  paddingNumber: 10000,
  burnRate: 0.25,
};

export class TransmutationService {
  web3;
  contract;
  daoAddress;
  accountAddress;

  constructor(web3, accountAddress, bcProcessor) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(abi, setupValues.contractAddress);
    this.accountAddress = accountAddress;
    this.bcProcessor = bcProcessor;
  }

  calcTribute(paymentRequested) {
    if (!paymentRequested || isNaN(paymentRequested)) {
      return '0';
    }
    const bnExchange = this.web3.utils.toBN(
      setupValues.exchangeRate * setupValues.paddingNumber,
    );

    const bnTributeOffered = this.web3.utils.toBN(
      this.web3.utils.toWei('' + paymentRequested),
    );
    const tributeOffered = bnTributeOffered
      .mul(bnExchange)
      .div(this.web3.utils.toBN(setupValues.paddingNumber));

    return tributeOffered;
  }

  async giveToken() {
    return this.contract.methods.giveToken().call();
  }

  async getToken() {
    return this.contract.methods.getToken().call();
  }

  async propose(applicant, paymentRequested, description) {
    const txReceipt = await this.contract.methods
      .propose(
        applicant,
        this.calcTribute(paymentRequested),
        this.web3.utils.toWei('' + paymentRequested),
        description,
      )
      .send({ from: this.accountAddress });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddress,
      `Transmutate ${this.calcTribute(paymentRequested)} Tokens`,
      true,
    );
    return txReceipt.transactionHash;
  }
}
