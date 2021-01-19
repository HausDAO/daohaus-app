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

    const threshhold = 2;
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
        threshhold,
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

  /**
   * Encodes a transaction from the Gnosis API into a module transaction
   * @returns ABI encoded function call to `execTransactionFromModule`
   */
  execTransactionFromModule(to, value, data, operation) {
    return this.safe.methods
      .execTransactionFromModule(
        to,
        value,
        data !== null ? data : '0x',
        operation,
      )
      .encodeABI();
  }

  /**
   * Encodes a transaction from the Gnosis API into a multisig transaction
   * @returns ABI encoded function call to `execTransaction`
   */
  execTransaction(
    to,
    value,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    signatures,
  ) {
    return this.safe.methods
      .execTransaction(
        to,
        value,
        data !== null ? data : '0x',
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        signatures,
      )
      .encodeABI();
  }
}
