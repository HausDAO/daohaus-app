import Web3 from 'web3';
import abi from '../contracts/minionFactory.json';

export class MinionService {
  web3;
  contract;
  daoAddress;
  accountAddress;
  setupValues;

  constructor(web3, accountAddress, setupValues) {
    console.log('service init', accountAddress, setupValues);
    if (!web3) {
      web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.REACT_APP_RPC_URI),
      );
    }
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
      });
  }

  async summonMinion(daoAddress, callback) {
    const newTx = await this.contract.methods.summonMinion(daoAddress);
    const txReceipt = await this.sendTx('summonMinion', newTx, callback);
    return txReceipt.transactionHash;
  }
}
