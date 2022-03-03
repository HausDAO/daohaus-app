import SafeMasterCopy from '@gnosis.pm/safe-contracts/build/artifacts/contracts/GnosisSafe.sol/GnosisSafe.json';
import Safe, { Web3Adapter } from '@gnosis.pm/safe-core-sdk';
import { deployAndSetUpModule } from '@gnosis.pm/zodiac';
import { ethers } from 'ethers';
import { encodeMulti, encodeSingle, TransactionType } from 'ethers-multisend';
import Web3 from 'web3';

import { getLocalABI } from './abi';
import { chainByID } from './chain';
import { createContract } from './contract';
import { postApiGnosis, postGnosisRelayApi } from './requests';
import { CONTRACTS } from '../data/contracts';

export const isAmbModule = async (
  address,
  controller,
  chainId,
  targetChainId,
) => {
  const abi = getLocalABI(CONTRACTS.AMB_MODULE);
  const contract = createContract({ address, abi, chainID: targetChainId });
  try {
    const props = await Promise.all([
      Web3.utils.toChecksumAddress(
        await contract.methods.controller().call(),
      ) === Web3.utils.toChecksumAddress(controller),
      Number(await contract.methods.chainId().call()) === Number(chainId),
    ]);
    return props.every(v => !!v);
  } catch (error) {
    console.error('Not an AMB module', address, error);
    return false;
  }
};

export const getSafe = async ({
  chainID,
  injectedProvider,
  safeAddress,
  signerAddress,
}) => {
  const rpcUrl = chainByID(chainID).rpc_url;
  const web3 =
    injectedProvider || new Web3(new Web3.providers.HttpProvider(rpcUrl));
  const ethAdapter = new Web3Adapter({
    web3,
    signerAddress,
  });
  return Safe.create({ ethAdapter, safeAddress });
};

export const isModuleEnabled = async (chainID, safeAddress, moduleAddress) => {
  const safeSdk = await getSafe({
    chainID,
    safeAddress,
  });
  return safeSdk.isModuleEnabled(moduleAddress);
};

export const fetchAmbModule = async (
  ambController, // { chainId, address }
  foreignChainId,
  foreignSafeAddress,
) => {
  const safeSdk = await getSafe({
    chainID: foreignChainId,
    safeAddress: foreignSafeAddress,
  });
  const modules = await safeSdk.getModules();
  return (
    await Promise.all(
      modules.map(async moduleAddress => {
        return (
          (await isAmbModule(
            moduleAddress,
            ambController.address,
            ambController.chainId,
            foreignChainId,
          )) && moduleAddress
        );
      }),
    )
  ).find(v => v);
};

export const fetchSafeDetails = async ({
  chainID,
  safeAddress,
  minionAddress,
  ambController, // if cross-chain minion -> { chainid, address }
}) => {
  const safeSdk = await getSafe({
    chainID,
    safeAddress,
  });

  return {
    address: safeSdk.getAddress(),
    owners: await safeSdk.getOwners(),
    threshold: await safeSdk.getThreshold(),
    isMinionModule:
      minionAddress && (await safeSdk.isModuleEnabled(minionAddress)),
    ambModuleAddress:
      ambController &&
      (await fetchAmbModule(ambController, chainID, safeAddress)),
  };
};

export const createGnosisSafeTxProposal = async ({
  chainID,
  web3,
  safeAddress,
  fromDelegate,
  to,
  value,
  data,
  operation,
}) => {
  const { network, networkAlt } = chainByID(chainID);
  const networkName = networkAlt || network;
  const txBase = {
    to: web3.utils.toChecksumAddress(to),
    value,
    data,
    operation,
    gasToken: null,
  };
  const safeSdk = await getSafe({
    chainID,
    safeAddress,
  });
  const gasEstimate =
    ['mainnnet', 'rinkeby', 'goerli'].includes(networkName) &&
    (await postGnosisRelayApi(
      networkName,
      `safes/${safeAddress}/transactions/estimate/`,
      txBase,
    ));

  // TODO: consider Txs in the queue?
  const nonce = await safeSdk.getNonce();
  const safeTxGas = gasEstimate ? gasEstimate.data.safeTxGas : 0;
  const txRefund = {
    gasToken: ethers.constants.AddressZero,
    baseGas: 0,
    gasPrice: 0,
    refundReceiver: ethers.constants.AddressZero,
  };
  const txDetails = {
    safeTxGas,
    nonce,
    ...txBase,
    ...txRefund,
  };
  const safe = new web3.eth.Contract(SafeMasterCopy.abi, safeAddress);
  const txHash = await safe.methods
    .getTransactionHash(
      txBase.to,
      txBase.value,
      txBase.data,
      txBase.operation,
      txDetails.safeTxGas,
      txRefund.baseGas,
      txRefund.gasPrice,
      txRefund.gasToken,
      txRefund.refundReceiver,
      txDetails.nonce,
    )
    .call();

  const txProposal = {
    tx: txDetails,
    txHash,
  };
  // TODO: EIP-712 compliant?
  const signature = await web3.eth.personal.sign(
    txProposal.txHash,
    fromDelegate,
  );
  const r = signature.slice(0, 66);
  const s = signature.slice(66, 130);
  // eth_sign signature -> signature_type > 30 -> v = v + 4
  const v = (parseInt(signature.slice(130, 132), 16) + 4).toString(16);

  const tx = {
    ...txProposal.tx,
    contractTransactionHash: txProposal.txHash,
    sender: fromDelegate,
    signature: r + s + v,
    origin: 'Minion Safe enableModule Tx Proposal',
  };

  try {
    await postApiGnosis(
      networkName,
      `safes/${safeAddress}/multisig-transactions/`,
      tx,
      false,
    );
  } catch (error) {
    console.error('Errow while calling Gnosis API', error);
    throw new Error(error);
  }
};

export const encodeSwapSafeOwnersBy = async (
  chainID,
  safeAddress,
  newOwnerAddress,
) => {
  const config = chainByID(chainID).safeMinion;
  if (!config?.safe_mutisend_addr) {
    throw new Error(
      'No multiSend contract address found for target chain',
      chainID,
    );
  }
  try {
    const safeSdk = await getSafe({
      chainID,
      safeAddress,
    });
    const currentOwners = await safeSdk.getOwners();
    const txs = [
      encodeSingle({
        id: 0,
        type: TransactionType.callContract,
        to: safeAddress,
        value: '0',
        abi: SafeMasterCopy.abi,
        functionSignature: 'addOwnerWithThreshold(address,uint256)',
        inputValues: {
          owner: newOwnerAddress,
          _threshold: '1',
        },
      }),
      ...currentOwners.map((owner, i) =>
        encodeSingle({
          id: i + 1,
          type: TransactionType.callContract,
          to: safeAddress,
          value: '0',
          abi: SafeMasterCopy.abi,
          functionSignature: 'removeOwner(address,address,uint256)',
          inputValues: {
            prevOwner: newOwnerAddress,
            owner,
            _threshold: '1',
          },
        }),
      ),
    ];
    return encodeMulti(txs, config.safe_mutisend_addr);
  } catch (error) {
    console.error('An error occurred while trying to encode Txs', error);
  }
};

export const prepareZodiacModuleSetupTx = (
  chainId,
  injectedProvider,
  moduleName,
  setupParams, // { types: [string], values: [string] }
  saltNonce,
) => {
  const provider = new ethers.providers.Web3Provider(
    injectedProvider.currentProvider,
  );
  const { transaction, expectedModuleAddress } = deployAndSetUpModule(
    moduleName,
    setupParams,
    provider,
    Number(chainId),
    saltNonce,
  );

  return {
    transaction,
    expectedModuleAddress,
  };
};

export const deployZodiacBridgeModule = async (
  owner,
  avatar,
  target,
  amb,
  controller,
  chainId,
  injectedProvider,
  saltNonce = null,
) => {
  try {
    const bridgeChainId = `0x${chainId.slice(2).padStart(64, '0')}`;
    const { transaction, expectedModuleAddress } = prepareZodiacModuleSetupTx(
      chainId,
      injectedProvider,
      'bridge',
      {
        types: [
          'address',
          'address',
          'address',
          'address',
          'address',
          'bytes32',
        ],
        values: [owner, avatar, target, amb, controller, bridgeChainId],
      },
      saltNonce || Date.now().toString(),
    );
    const provider = new ethers.providers.Web3Provider(
      injectedProvider.currentProvider,
    );
    const tx = await provider.getSigner().sendTransaction(transaction);
    await tx.wait();
    return expectedModuleAddress;
  } catch (error) {
    console.error(error);
  }
};

export const encodeAmbTxProposal = async (
  ambModuleAddress,
  chainId,
  encodedTx,
  targetChainId,
) => {
  const config = chainByID(targetChainId).zodiac_amb_module;
  if (!config.amb_bridge_address[chainId]) {
    throw new Error('AMB not available for target chain', targetChainId);
  }
  try {
    const ambModule = new ethers.Contract(
      ambModuleAddress,
      getLocalABI(CONTRACTS.AMB_MODULE),
    );
    const moduleTx = await ambModule.populateTransaction.executeTransaction(
      encodedTx.to,
      encodedTx.value,
      encodedTx.data,
      encodedTx.operation,
    );
    const ambAbi = getLocalABI(CONTRACTS.AMB);
    const selectedFunction = ambAbi.find(
      entry => entry.name === 'requireToPassMessage',
    );

    return {
      targetContract: config.amb_bridge_address[chainId],
      abiInput: JSON.stringify(selectedFunction),
      abiArgs: [moduleTx.to, moduleTx.data, config.gas_limit[chainId]],
    };
  } catch (error) {
    console.error('failed to encodeAmbTxMessage', error);
  }
};
