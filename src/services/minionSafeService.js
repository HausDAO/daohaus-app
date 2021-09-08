import { ethers } from 'ethers';
import Web3 from 'web3';

import minionSafeModuleEnablerAbi from '../contracts/minionSafeModuleEnabler.json';
import safeMasterCopyAbi from '../contracts/safeGnosis.json';
import safeMultisendAbi from '../contracts/safeMultisend.json';
import safeProxyFactoryAbi from '../contracts/safeProxyFactory.json';

import { chainByID } from '../utils/chain';

export const MinionSafeService = ({ web3, chainID }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  const networkConfig = chainByID(chainID);

  const safeConfig = networkConfig.gnosis_safe;
  const safeProxyFactoryAddress = safeConfig.proxy_factory;
  const createAndAddModulesAddress = safeConfig.create_and_add_modules;
  const safeMasterCopyAddress = safeConfig.master_copy;
  const multiSendAddress = safeConfig.multisend;
  const moduleEnablerAddress = safeConfig.module_enabler;

  const safeProxyFactory = new web3.eth.Contract(
    safeProxyFactoryAbi,
    safeProxyFactoryAddress,
  );

  return service => {
    // common entrypoint for contract view methods
    if (service === 'call') {
      return async ({ safeAddress, method, args }) => {
        const safeContract = new web3.eth.Contract(
          safeMasterCopyAbi,
          safeAddress,
        );
        const rs = await safeContract.methods[method](...args).call();
        return rs;
      };
    }
    if (service === 'enableMinionModule') {
      return ({ minionAddress }) => {
        if (!moduleEnablerAddress) {
          throw new Error('Minion Safe not supported in current network.');
        }
        const moduleEnabler = new web3.eth.Contract(
          minionSafeModuleEnablerAbi,
          moduleEnablerAddress,
        );
        return moduleEnabler.methods.enableModule(minionAddress).encodeABI();
      };
    }
    // useful when a module was already deployed and setup
    if (service === 'enableModule') {
      return async ({ moduleAddress }) => {
        try {
          const safeContract = new web3.eth.Contract(
            safeMasterCopyAbi,
            safeMasterCopyAddress,
          );
          const enableModuleData = safeContract.methods
            .enableModule(moduleAddress)
            .encodeABI();
          return enableModuleData;
        } catch (err) {
          console.log(err);
        }
        return null;
      };
    }
    if (service === 'swapOwner') {
      return ({ safeAddress, args }) => {
        const safeContract = new web3.eth.Contract(
          safeMasterCopyAbi,
          safeAddress,
        );
        return safeContract.methods.swapOwner(...args).encodeABI();
      };
    }
    // TODO: include extra modules
    // extraModules: [ {  } ]
    if (service === 'setupSafeModuleData') {
      return async ({
        signers,
        threshold,
        enableModuleAddress,
        enableModuleData,
        // extraModules = [],
      }) => {
        try {
          const safeContract = new web3.eth.Contract(
            safeMasterCopyAbi,
            safeMasterCopyAddress,
          );

          // TODO: additional modules e.g. AMB module
          // if (extraModules) {
          //   console.log('TODO: Set Extra modules');
          //   // const moduleDataWrapper = new web3.eth.Contract(safeModuleDataWrapperAbi);
          //   // const moduleData = []; // TODO: ABI encoded data for each module
          //   // // Remove method id (10) and position of data in payload (64)
          //   // const modulesCreationData = moduleData.reduce(
          //   //   (acc, data) =>
          //   //     acc +
          //   //     moduleDataWrapper.methods
          //   //       .setup(data)
          //   //       .encodeABI()
          //   //       .substr(74),
          //   //   '0x',
          //   // );
          // }
          const addModulesContract =
            enableModuleAddress || createAndAddModulesAddress;

          return safeContract.methods
            .setup(
              signers, // owners
              threshold, // signatures threshold
              enableModuleData === '0x'
                ? ethers.constants.AddressZero
                : addModulesContract, // to - Contract address for optional delegate call.
              enableModuleData, // data - Data payload for optional delegate call.
              ethers.constants.AddressZero, // fallbackHandler
              ethers.constants.AddressZero, // paymentToken
              0, // payment
              ethers.constants.AddressZero, // paymentReceiver
            )
            .encodeABI();
        } catch (err) {
          console.log(err);
        }
        return null;
      };
    }
    if (service === 'calculateProxyAddress') {
      return async ({ saltNonce, setupData }) => {
        try {
          const proxyCreationCode = await safeProxyFactory.methods
            .proxyCreationCode()
            .call();
          const initCode = ethers.utils.solidityPack(
            ['bytes', 'uint256'],
            [proxyCreationCode, safeMasterCopyAddress],
          );
          const salt = ethers.utils.solidityKeccak256(
            ['bytes32', 'uint256'],
            [ethers.utils.solidityKeccak256(['bytes'], [setupData]), saltNonce],
          );
          return ethers.utils.getCreate2Address(
            safeProxyFactory.options.address,
            salt,
            ethers.utils.keccak256(initCode),
          );
        } catch (error) {
          console.error('error', error);
        }
        return null;
      };
    }
    // args: [ mastercopy, setupData, saltNonce ]
    if (service === 'createProxyWithNonce') {
      return async ({ args, address, poll, onTxHash }) => {
        try {
          const tx = await safeProxyFactory.methods[service](...args);
          return tx
            .send({ from: address })
            .on('transactionHash', txHash => {
              if (poll) {
                onTxHash();
                poll(txHash);
              }
            })
            .on('error', error => {
              console.error(error);
            });
        } catch (error) {
          console.error('error', error);
          return error;
        }
      };
    }
    if (service === 'approveHash') {
      return ({ safeAddress, args }) => {
        const safe = new web3.eth.Contract(safeMasterCopyAbi, safeAddress);
        return safe.methods.approveHash(...args).encodeABI();
      };
    }
    if (service === 'isHashApproved') {
      return async ({ safeAddress, args }) => {
        const safe = new web3.eth.Contract(safeMasterCopyAbi, safeAddress);
        return safe.methods.approvedHashes(...args).call();
      };
    }
    if (service === 'getTransactionHash') {
      return async ({ safeAddress, args }) => {
        const safe = new web3.eth.Contract(safeMasterCopyAbi, safeAddress);
        return safe.methods.getTransactionHash(...args).call();
      };
    }
    if (service === 'execTransactionFromModule') {
      return ({ to, value, data, operation }) => {
        /**
         * Encodes a transaction from the Gnosis API into a module transaction
         * @returns ABI encoded function call to `execTransactionFromModule`
         */
        const safeContract = new web3.eth.Contract(
          safeMasterCopyAbi,
          safeMasterCopyAddress,
        );
        return safeContract.methods
          .execTransactionFromModule(
            to,
            value,
            data !== null ? data : '0x',
            operation,
          )
          .encodeABI();
      };
    }
    if (service === 'multisendCall') {
      // txList -> Array<Tx>
      // Tx -> { to, vakue, data, operation }
      return ({ txList }) => {
        const encodedTxData = `0x
          ${txList
            .map(tx => {
              const data = ethers.utils.arrayify(tx.data);
              const encoded = ethers.utils.solidityPack(
                ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
                [tx.operation, tx.to, tx.value, data.length, data],
              );
              return encoded.slice(2);
            })
            .join('')}`;
        const multisendContract = new web3.eth.Contract(
          safeMultisendAbi,
          multiSendAddress,
        );

        return multisendContract.methods.multiSend(encodedTxData).encodeABI();
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
        const safeContract = new web3.eth.Contract(
          safeMasterCopyAbi,
          safeMasterCopyAddress,
        );
        return safeContract.methods
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
  };
};
