import Web3 from 'web3';
import abi from '../contracts/minion.json';

export class MinionService {
  web3;
  contract;
  daoAddress;
  accountAddress;
  setupValues;

  constructor(web3, accountAddress, setupValues) {
    if (!web3) {
      web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.REACT_APP_RPC_URI),
      );
    }
    this.web3 = web3;
    this.contract = new web3.eth.Contract(abi, setupValues.minion);
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

  async propose(actionTo, actionVlaue, actionData, description, callback) {
    console.log(
      'service',
      actionTo,
      actionVlaue,
      actionData,
      this.accountAddress,
      description,
    );

    const txReceipt = await this.sendTx(
      {
        from: this.accountAddress,
        name: 'proposeAction',
        params: [actionTo, actionVlaue, actionData, description],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async executeAction(proposalId, callback) {
    const txReceipt = await this.sendTx(
      {
        from: this.accountAddress,
        name: 'executeAction',
        params: [proposalId],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async getAction(proposalId) {
    let action;
    try {
      action = await this.contract.methods.actions(proposalId).call();
      return action;
    } catch {
      return undefined;
    }
  }
}
