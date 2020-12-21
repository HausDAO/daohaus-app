import abi from '../contracts/minionFactory.json';

export class MinionFactoryService {
  web3;
  contract;
  daoAddress;
  accountAddress;
  setupValues;

  constructor(web3, accountAddress, setupValues) {
    console.log('service init', accountAddress, setupValues);
    this.web3 = web3;
    this.contract = new web3.eth.Contract(abi, setupValues.minionFactory);
    this.accountAddress = accountAddress;
    this.setupValues = setupValues;
  }

  // internal
  sendTx(name, tx, callback) {
    console.log('this.accountAddr', this.accountAddress);
    return tx
      .send({ from: this.accountAddress })
      .on('transactionHash', (txHash) => {
        console.log('txHash', txHash);
        callback(txHash, name);
      })
      .on('error', (error) => {
        callback(null, error);
      });
  }

  async summonMinion(daoAddress, details = '', callback) {
    const newTx = await this.contract.methods.summonMinion(daoAddress, details);
    const txReceipt = await this.sendTx('summonMinion', newTx, callback);
    return txReceipt.transactionHash;
  }
}
