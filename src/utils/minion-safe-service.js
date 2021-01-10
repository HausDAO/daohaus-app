import abi from '../contracts/gnosisSafe.json.json';

export class GnosisSafeService {
  web3;
  contract;
  daoAddress;
  accountAddress;
  setupValues;

  constructor(web3, accountAddress, setupValues) {
    console.log('service init', accountAddress, setupValues);
    this.web3 = web3;
    this.contract = new web3.eth.Contract(abi, setupValues.gnosisSafe);
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

  async setup(
    delegateAddress,
    minionAddress,
    threshhold,
    matercopy,
    enableModuleData,
    callback,
  ) {
    /*
      setup(
    [DELEGATE_ADDRESS, MINION_ADDRESS],
    2,
    GNOSIS_SAFE_MASTERCOPY,
    ENABLE_MODULE_DATA,
    0,
    0,
    0,
    0
)
      */
    const txReceipt = await this.sendTx(
      {
        from: this.accountAddress,
        name: 'setup',
        params: [
          delegateAddress,
          minionAddress,
          threshhold,
          matercopy,
          enableModuleData,
        ],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }
}
