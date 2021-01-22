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
  sendTx(options, callback) {
    const { from, name, params } = options;
    const tx = this.contract.methods[name](...params);
    return tx
      .send({ from: from })
      .on('transactionHash', (txHash) => {
        console.log('txHash', txHash);
        callback(txHash, options);
      })
      .on('error', (error) => {
        callback(null, error);
      });
  }

  async summonMinion(daoAddress, details = '', callback) {
    const txReceipt = await this.sendTx(
      {
        from: this.accountAddress,
        name: 'summonMinion',
        params: [daoAddress, details],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }
}
