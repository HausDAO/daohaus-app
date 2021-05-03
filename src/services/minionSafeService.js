import Web3 from 'web3';

import safeProxyFactoryAbi from '../contracts/safeProxyFactory.json';
// import safeCreateAndAddModulesAbi from '../contracts/safeCreateAndAddModule.json';
import safeMasterCopyAbi from '../contracts/safeGnosis.json';
import { chainByID } from '../utils/chain';

// minionSafeSetupValues = {
//  safeProxyFactoryAddress: 'proxy factory address',
//  createAndAddModulesAddress: 'create modules proxy address',
//  safeMasterCopy: 'master safe?', // current safe?
//  moduleEnabler: '',
// }

export const MinionSafeService = ({ web3, setupValues, chainID }) => {
  // console.log('web3', web3);
  // console.log('daoAddress', daoAddress);
  // console.log('version', version);
  // console.log('chainID', chainID);
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  // contract for deploying new safes
  const safeProxyFactoryContract = new web3.eth.Contract(
    safeProxyFactoryAbi,
    setupValues.safeProxyFactoryAddress,
  );
  // contract for deploying safe modules
  // const safeCreateAndAddModulesContract = new web3.eth.Contract(
  //   safeCreateAndAddModulesAbi,
  //   setupValues.createAndAddModulesAddress,
  // );
  // contract for the safe
  const safe = new web3.eth.Contract(
    safeMasterCopyAbi,
    setupValues.safeMasterCopy,
  );
  const { moduleEnabler } = setupValues;

  return function getService(service) {
    // console.log('service', service);

    if (service === 'setLocal') {
      return async ({ newData }) => {
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
      };
    }
    if (service === 'enableModule') {
      return async ({ minionAddress }) => {
        try {
          const enableModuleData = await safe.methods
            .enableModule(minionAddress)
            .encodeABI();
          return enableModuleData;
        } catch (err) {
          console.log(err);
        }
        return null;
      };
    }
    if (service === 'setupModuleData') {
      return ({ delegateAddress, minionAddress, enableModuleData }) => {
        const threshold = 2;
        const Address0 = '0x'.padEnd(42, '0');
        try {
          return safe.methods
            .setup(
              [delegateAddress, minionAddress],
              threshold,
              moduleEnabler,
              enableModuleData,
              Address0,
              Address0,
              0,
              Address0,
            )
            .encodeABI();
        } catch (err) {
          console.log(err);
        }
        return null;
      };
    }
    if (service === 'execTransactionFromModule') {
      return ({ to, value, data, operation }) => {
        /**
         * Encodes a transaction from the Gnosis API into a module transaction
         * @returns ABI encoded function call to `execTransactionFromModule`
         */
        return safe.methods
          .execTransactionFromModule(
            to,
            value,
            data !== null ? data : '0x',
            operation,
          )
          .encodeABI();
      };
    }
    if (service === 'execTransaction') {
      return ({
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
      }) => {
        /**
         * Encodes a transaction from the Gnosis API into a multisig transaction
         * @returns ABI encoded function call to `execTransaction`
         */
        return safe.methods
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
      };
    }
    if (service === 'createProxy') {
      return async ({ args, address, poll, onTxHash }) => {
        console.log(args);
        console.log(address);
        console.log(poll);
        const tx = await safeProxyFactoryContract.methods[service](...args);
        return tx
          .send('eth_requestAccounts', { from: address })
          .on('transactionHash', txHash => {
            if (poll) {
              onTxHash();
              poll(txHash);
            }
          })
          .on('error', error => {
            console.error(error);
          });
      };
    }
    return null;
  };
};
