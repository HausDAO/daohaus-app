import safeProxyFactoryAbi from '../contracts/safeProxyFactory.json';
import safeCreateAndAddModulesAbi from '../contracts/safeCreateAndAddModule.json';
import safeMasterCopyAbi from '../contracts/safeGnosis.json';

export class MinionSafeService {
  web3;
  contract;
  daoAddress;
  accountAddress;
  setupValues;

  constructor(web3, accountAddress, setupValues) {
    console.log('service init', accountAddress, setupValues);
    this.web3 = web3;
    this.accountAddress = accountAddress;
    this.setupValues = setupValues;
    this.safeProxyFactory = setupValues.safeProxyFactory;
    this.createAndAddModules = setupValues.createAndAddModules;
    this.safeMasterCopy = setupValues.safeMasterCopy;
    this.safeProxyFactoryContract = new web3.eth.Contract(
      safeProxyFactoryAbi,
      this.safeProxyFactory,
    );
    this.safeCreateAndAddModulesContract = new web3.eth.Contract(
      safeCreateAndAddModulesAbi,
      this.safeCreateAndAddModulesAbi,
    );
    this.safeMasterCopyContract = new web3.eth.Contract(
      safeMasterCopyAbi,
      this.safeMasterCopy,
    );
  }

  // internal
  sendTx(contract, options, callback) {
    const { from, name, params } = options;
    const tx = contract.methods[name](...params);
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

  async setup(delegateAddress, minionAddress, callback) {
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
    const threshhold = 2;
    const mastercopy = this.safeMasterCopy;
    const enableModuleData = null;
    const setup = await this.safeMasterCopyContract.methods
      .setup(
        [delegateAddress, minionAddress],
        threshhold,
        mastercopy,
        enableModuleData,
        0,
        0,
        0,
        0,
      )
      .encodeABI();
    const txReceipt = await this.sendTx(
      this.safeProxyFactoryContract,
      {
        from: this.accountAddress,
        name: 'createProxy',
        params: [mastercopy, setup],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }
}
