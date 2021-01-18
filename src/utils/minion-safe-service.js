import safeProxyFactoryAbi from '../contracts/safeProxyFactory.json';
import safeCreateAndAddModulesAbi from '../contracts/safeCreateAndAddModule.json';
import safeMasterCopyAbi from '../contracts/safeGnosis.json';
import { supportedChains } from './chains';

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
    this.network = setupValues.network;
    this.safeProxyFactoryContract = new web3.eth.Contract(
      safeProxyFactoryAbi,
      this.safeProxyFactory,
    );
    this.safeCreateAndAddModulesContract = new web3.eth.Contract(
      safeCreateAndAddModulesAbi,
      this.createAndAddModulesAddress,
    );
    this.safe = new web3.eth.Contract(safeMasterCopyAbi, this.safeMasterCopy);
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

  setLocal(newData) {
    let localMinionSafe = window.localStorage.getItem('pendingMinionSafe');
    if (localMinionSafe) {
      localMinionSafe = JSON.parse(localMinionSafe);
    }

    window.localStorage.setItem(
      'pendingMinionSafe',
      JSON.stringify({
        ...localMinionSafe,
        ...newData,
      }),
    );
  }

  createAndAddModulesData(dataArray) {
    const ModuleDataWrapper = new this.web3.eth.Contract([
      {
        constant: false,
        inputs: [{ name: 'data', type: 'bytes' }],
        name: 'setup',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ]);

    // Remove method id (10) and position of data in payload (64)
    return dataArray.reduce(
      (acc, data) =>
        acc +
        ModuleDataWrapper.methods
          .setup(data)
          .encodeABI()
          .substr(74),
      '0x',
    );
  }

  async setup(delegateAddress, minionAddress, callback) {
    const Address0 = '0x'.padEnd(42, '0');

    const threshold = 2;
    const mastercopy = this.safeMasterCopy;

    const cacheMinionSafe = {
      delegateAddress,
      network: supportedChains[this.network.network_id].network,
    };

    const enableModuleData = this.safe.methods
      .enableModule(minionAddress)
      .encodeABI();

    const modulesCreationData = this.createAndAddModulesData([
      enableModuleData,
    ]);

    const createAndAddModulesData = this.safeCreateAndAddModulesContract.methods
      .createAndAddModules(this.safeProxyFactory, modulesCreationData)
      .encodeABI();

    const setupData = await this.safe.methods
      .setup(
        [delegateAddress, minionAddress],
        threshold,
        mastercopy,
        createAndAddModulesData,
        Address0,
        Address0,
        0,
        Address0,
      )
      .encodeABI();

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
    cacheMinionSafe.tx = txReceipt.transactionHash;
    cacheMinionSafe.safeAddress =
      txReceipt.events.ProxyCreation.returnValues.proxy;
    cacheMinionSafe.txReceipt = txReceipt;
    this.setLocal(cacheMinionSafe);
    return txReceipt.transactionHash;
  }

  async execTransactionFromModule(to, value, data, operation, callback) {
    const CALL = 0;

    const getModulesData = this.safe.methods.getModules().encodeABI();
    console.log('getModulesData', getModulesData);

    const setupData = await this.safe.methods
      .execTransactionFromModule(to, value, getModulesData, CALL)
      .encodeABI();
    return setupData;
  }
}
