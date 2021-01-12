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
    this.createAndAddModulesAddress = setupValues.createAndAddModules;
    this.safeMasterCopy = setupValues.safeMasterCopy;
    this.safeProxyFactoryContract = new web3.eth.Contract(
      safeProxyFactoryAbi,
      this.safeProxyFactory,
    );
    this.safeCreateAndAddModulesContract = new web3.eth.Contract(
      safeCreateAndAddModulesAbi,
      this.createAndAddModulesAddress,
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
    console.log('tx', tx);
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
    const Address0 = '0x'.padEnd(42, '0');

    const threshhold = 2;
    const mastercopy = this.safeMasterCopy;
    const createAndAddModulesContract = this.safeCreateAndAddModulesContract;

    const enableModuleData = createAndAddModulesContract.methods
      .enableModule(minionAddress)
      .encodeABI();
    console.log('enableModuleData', enableModuleData);
    const setupData = await this.safeMasterCopyContract.methods
      .setup(
        [delegateAddress, minionAddress],
        threshhold,
        this.createAndAddModulesAddress,
        enableModuleData,
        Address0,
        Address0,
        0,
        Address0,
      )
      .encodeABI();
    console.log('setup', setupData);
    const txReceipt = await this.sendTx(
      this.safeProxyFactoryContract,
      {
        from: this.accountAddress,
        name: 'createProxy',
        params: [mastercopy, setupData],
      },
      callback,
    );
    console.log('txReceipt', txReceipt);
    return txReceipt.transactionHash;
  }
}
