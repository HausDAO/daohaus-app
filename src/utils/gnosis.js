import SafeMasterCopy from '@gnosis.pm/safe-contracts/build/artifacts/contracts/GnosisSafe.sol/GnosisSafe.json';
import Safe from '@gnosis.pm/safe-core-sdk';
import { getSafeSingletonDeployment } from '@gnosis.pm/safe-deployments';
import Web3Adapter from '@gnosis.pm/safe-web3-lib';
import { deployAndSetUpModule } from '@gnosis.pm/zodiac';
import { utils as NomadUtils } from '@nomad-xyz/multi-provider';
import { ethers, utils } from 'ethers';
import { encodeMulti, encodeSingle, TransactionType } from 'ethers-multisend';
import Web3 from 'web3';

import { getLocalABI, getABIsnippet } from './abi';
import { chainByID } from './chain';
import { createContract } from './contract';
import { generateNonce } from './general';
import { MINION_TYPES } from './proposalUtils';
import { postApiGnosis, postGnosisRelayApi } from './requests';
import { CONTRACTS } from '../data/contracts';
import { BOOSTS } from '../data/boosts';

export const BRIDGE_MODULES = {
  AMB_MODULE: 'AMBModule',
  NOMAD_MODULE: 'NomadModule',
};

const NomadSDK = await import('@nomad-xyz/sdk');

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

export const isNomadModule = async (
  address,
  controller,
  domainId,
  targetChainId,
) => {
  const abi = getLocalABI(CONTRACTS.NOMAD_MODULE);
  const contract = createContract({ address, abi, chainID: targetChainId });
  try {
    const valid = await contract.methods
      .isController(controller, domainId)
      .call();
    return valid;
  } catch (error) {
    console.error('Not an Nomad module', address, error);
    return false;
  }
};

export const getSafe = async ({
  chainID,
  injectedProvider,
  safeAddress,
  signerAddress,
  patchV1,
}) => {
  try {
    const rpcUrl = chainByID(chainID).rpc_url;
    const web3 =
      injectedProvider || new Web3(new Web3.providers.HttpProvider(rpcUrl));
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress,
    });
    // Workaround when dealing with GnosisSafe w/version < 1.3.0
    // == BEGIN
    const networkChainId = (await ethAdapter.getChainId()).toString();
    const deployment = getSafeSingletonDeployment({
      version: patchV1 ? '1.1.1' : '1.3.0',
      network: networkChainId,
      released: true,
    });
    const contractNetworks = {
      [networkChainId]: {
        multisendAddress: '',
        safeProxyFactoryAddress: '',
        safeMasterCopyAddress: '',
        safeMasterCopyAbi: deployment?.abi,
      },
    };
    // == END
    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress,
      contractNetworks,
    });
    return safeSdk;
  } catch (error) {
    console.log('ERROR getSafe', error);
  }
};

const getSafeInternal = async ({ chainID, safeAddress }) => {
  const safeSdk = await getSafe({ chainID, safeAddress });
  const v = await safeSdk.getContractVersion();
  if (v === '1.1.1') {
    return getSafe({ chainID, safeAddress, patchV1: true });
  }
  return safeSdk;
};

const isModuleEnabledInternal = async (safeSdk, moduleAddress) => {
  const v = await safeSdk.getContractVersion();
  if (v === '1.1.1') {
    const safeSdkV1 = await getSafe({
      chainID: `0x${(await safeSdk.getChainId()).toString(16)}`,
      safeAddress: safeSdk.getAddress(),
      patchV1: true,
    });
    const modules = await safeSdkV1.getModules();
    return modules.map(m => m.toLowerCase()).includes(moduleAddress);
  }
  return safeSdk.isModuleEnabled(moduleAddress);
};

export const isModuleEnabled = async (chainID, safeAddress, moduleAddress) => {
  const safeSdk = await getSafe({
    chainID,
    safeAddress,
  });
  return isModuleEnabledInternal(safeSdk, moduleAddress);
};

export const fetchAmbModule = async (
  ambController, // { chainId, address }
  foreignChainId,
  foreignSafeAddress,
) => {
  const safeSdk = await getSafeInternal({
    chainID: foreignChainId,
    safeAddress: foreignSafeAddress,
  });
  const modules = await safeSdk?.getModules();
  if (!modules) return;
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

export const fetchNomadModule = async (
  controller, // { address, domainId }
  foreignChainId,
  foreignSafeAddress,
) => {
  const safeSdk = await getSafeInternal({
    chainID: foreignChainId,
    safeAddress: foreignSafeAddress,
  });
  const modules = await safeSdk?.getModules();
  if (!modules) return;
  return (
    await Promise.all(
      modules.map(async moduleAddress => {
        return (
          (await isNomadModule(
            moduleAddress,
            controller.address,
            controller.domainId,
            foreignChainId,
          )) && moduleAddress
        );
      }),
    )
  ).find(v => v);
};

export const fetchCrossChainZodiacModule = async ({
  chainID,
  crossChainController, // { address, bridgeModule, chainId }
  safeAddress,
}) => {
  const { bridgeModule } = crossChainController;
  if (bridgeModule === BRIDGE_MODULES.AMB_MODULE)
    return fetchAmbModule(
      {
        chainId: crossChainController.chainId,
        address: crossChainController.address,
      },
      chainID,
      safeAddress,
    );
  if (bridgeModule === BRIDGE_MODULES.NOMAD_MODULE) {
    const { domainId } = chainByID(
      crossChainController.chainId,
    )?.zodiac_nomad_module;
    if (domainId)
      return fetchNomadModule(
        {
          domainId,
          address: crossChainController.address,
        },
        chainID,
        safeAddress,
      );
  }
};

export const fetchSafeDetails = async ({
  chainID,
  safeAddress,
  minionAddress,
  crossChainController, // if cross-chain minion -> { address, bridgeModule, chainId }
}) => {
  const safeSdk = await getSafeInternal({
    chainID,
    safeAddress,
  });

  if (!safeSdk) return;

  return {
    address: safeSdk.getAddress(),
    owners: await safeSdk.getOwners(),
    threshold: await safeSdk.getThreshold(),
    isMinionModule:
      minionAddress && (await isModuleEnabledInternal(safeSdk, minionAddress)),
    crossChainModuleAddress:
      crossChainController &&
      (await fetchCrossChainZodiacModule({
        chainID,
        crossChainController,
        safeAddress,
      })),
    gnosisSafeVersion: await safeSdk.getContractVersion(),
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
  const safeSdk = await getSafeInternal({
    chainID,
    safeAddress,
  });
  if (!safeSdk) throw new Error('Safe not found');
  const gasEstimate =
    ['mainnnet', 'goerli'].includes(networkName) &&
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
  const preV = parseInt(signature.slice(130, 132), 16);
  const v =
    preV < 2
      ? (preV === 0 ? 31 : 32).toString(16) // workaround Ledger signatures -> https://ethereum.stackexchange.com/a/113727
      : (preV + 4).toString(16);

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
    const safeSdk = await getSafeInternal({
      chainID,
      safeAddress,
    });
    if (!safeSdk) throw new Error('Safe not found');
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
      saltNonce || generateNonce(),
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

export const deployZodiacNomadModule = async (
  owner,
  avatar,
  target,
  manager,
  controller,
  controllerDomain,
  chainId,
  foreignChainId,
  injectedProvider,
  saltNonce = null,
) => {
  try {
    const { masterCopyAddress, moduleProxyFactory } = chainByID(
      chainId,
    ).zodiac_nomad_module;

    const provider = new ethers.providers.Web3Provider(
      injectedProvider.currentProvider,
    );

    // TODO: This is a temporary solution until NomadModule is officialy added to Zodiac
    // Then, use `prepareZodiacModuleSetupTx` defined above
    const factoryAbi = [
      'function deployModule(address masterCopy, bytes memory initializer, uint256 saltNonce) public returns (address proxy)',
    ];
    const factory = new ethers.Contract(
      moduleProxyFactory[foreignChainId],
      factoryAbi,
      provider,
    );

    const moduleAbi = getLocalABI(CONTRACTS.NOMAD_MODULE);
    const masterCopyModule = new ethers.Contract(
      masterCopyAddress[foreignChainId],
      moduleAbi,
      provider,
    );
    const args = {
      types: ['address', 'address', 'address', 'address', 'address', 'uint32'],
      values: [owner, avatar, target, manager, controller, controllerDomain],
    };

    const encodedInitParams = ethers.utils.defaultAbiCoder.encode(
      args.types,
      args.values,
    );
    const moduleSetupData = masterCopyModule.interface.encodeFunctionData(
      'setUp',
      [encodedInitParams],
    );
    const calculateProxyAddress = (
      factory,
      masterCopy,
      initData,
      proxySaltNonce,
    ) => {
      const byteCode =
        '0x602d8060093d393df3363d3d373d3d3d363d73' +
        masterCopy.toLowerCase().replace(/^0x/, '') +
        '5af43d82803e903d91602b57fd5bf3';
      const salt = ethers.utils.solidityKeccak256(
        ['bytes32', 'uint256'],
        [ethers.utils.solidityKeccak256(['bytes'], [initData]), proxySaltNonce],
      );
      return ethers.utils.getCreate2Address(
        factory.address,
        salt,
        ethers.utils.keccak256(byteCode),
      );
    };
    const proxySaltNonce = saltNonce || generateNonce();
    const expectedModuleAddress = calculateProxyAddress(
      factory,
      masterCopyModule.address,
      moduleSetupData,
      proxySaltNonce,
    );
    const deployData = factory.interface.encodeFunctionData('deployModule', [
      masterCopyModule.address,
      moduleSetupData,
      proxySaltNonce,
    ]);

    const transaction = {
      data: deployData,
      to: factory.address,
      value: ethers.BigNumber.from(0),
    };
    // END TODO

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
  encodedTx, // multisend encoded tx -> { to, data, value, operation }
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

export const encodeNomadTxProposal = async (
  nomadModuleAddress,
  chainId,
  encodedTx, // multisend encoded tx -> { to, data, value, operation }
  targetChainId,
) => {
  const homeChainConfig = chainByID(chainId);
  const targetChainConfig = chainByID(targetChainId);
  const homeNomadConfig = homeChainConfig.zodiac_nomad_module;
  if (
    !homeNomadConfig.bridge_domain_ids[targetChainId] ||
    !targetChainConfig?.safeMinion?.safe_mutisend_addr
  ) {
    throw new Error('Nomad not available for target chain', targetChainId);
  }
  const destinationDomainId = homeNomadConfig.bridge_domain_ids[targetChainId];
  // Nomad module from Avatar in foreign chain
  const recipientAddress = utils.hexlify(
    NomadUtils.canonizeId(nomadModuleAddress),
  );
  const messageBody = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256', 'bytes', 'uint8'],
    [encodedTx.to, encodedTx.value, encodedTx.data, encodedTx.operation],
  );
  const dispatchFunction = getABIsnippet({
    contract: CONTRACTS.NOMAD_HOME,
    fnName: 'dispatch',
  });
  return {
    targetContract: homeNomadConfig.homeContract,
    abiInput: JSON.stringify(dispatchFunction),
    abiArgs: [destinationDomainId, recipientAddress, messageBody],
  };
};

export const encodeBridgeTxProposal = async ({
  bridgeModule,
  bridgeModuleAddress,
  daochain,
  encodedTx,
  foreignChainId,
}) => {
  if (bridgeModule === BRIDGE_MODULES.AMB_MODULE)
    return encodeAmbTxProposal(
      bridgeModuleAddress,
      daochain,
      encodedTx,
      foreignChainId,
    );
  if (bridgeModule === BRIDGE_MODULES.NOMAD_MODULE)
    return encodeNomadTxProposal(
      bridgeModuleAddress,
      daochain,
      encodedTx,
      foreignChainId,
    );
};

const nomadRegisterRpcProvider = (core, network, rpcURI) => {
  core.registerRpcProvider(
    network === 'mainnet' ? 'ethereum' : network,
    rpcURI,
  );
};

const getNomadMessages = (core, network, txHash) => {
  return NomadSDK.NomadMessage.baseFromTransactionHash(
    core,
    network === 'mainnet' ? 'ethereum' : network,
    txHash,
  );
};

export const getNomadTxStatus = async ({
  homeChainId,
  foreignChainId,
  txHash,
}) => {
  try {
    const homeChainConfig = chainByID(homeChainId);
    const foreignChainConfig = chainByID(foreignChainId);
    const core = new NomadSDK.NomadContext(
      homeChainConfig.zodiac_nomad_module.environment,
    );
    nomadRegisterRpcProvider(
      core,
      homeChainConfig.network,
      homeChainConfig.rpc_url,
    );
    nomadRegisterRpcProvider(
      core,
      foreignChainConfig.network,
      foreignChainConfig.rpc_url,
    );
    const messages = await getNomadMessages(
      core,
      homeChainConfig.network,
      txHash,
    );
    const msgToInspect = messages.length && messages[0];
    const nomadStatus = await msgToInspect.events(); // { status, events }

    if (nomadStatus.status === NomadSDK.MessageStatus.Dispatched)
      return {
        statusMsg: 'Dispatched',
        stage: 'Home',
        txHash: nomadStatus.events[0].transactionHash,
      };

    if (nomadStatus.status === NomadSDK.MessageStatus.Included)
      return {
        statusMsg: 'Processing',
        stage: 'Home',
        txHash: nomadStatus.events[1].transactionHash,
      };

    if (nomadStatus.status === NomadSDK.MessageStatus.Relayed) {
      const confirmAt = Number((await msgToInspect.confirmAt()).toString());
      return {
        statusMsg: 'Relayed',
        stage: 'Replica',
        attestOK: Date.now() / 1000 > confirmAt,
        txHash: nomadStatus.events[2].transactionHash,
      };
    }

    if (nomadStatus.status === NomadSDK.MessageStatus.Processed) {
      return {
        statusMsg: 'Processed',
        stage: 'Replica',
        success: nomadStatus.events[3].event.args.success,
        txHash: nomadStatus.events[3].transactionHash,
      };
    } else {
      // 0: None | 1: Proven | 2: Processed
      const replicaStatus = await msgToInspect.replicaStatus();
      if (replicaStatus === NomadSDK.ReplicaMessageStatus.None)
        return {
          statusMsg: 'Waiting Period',
          stage: 'Replica',
        };
      return {
        statusMsg: 'Proven',
        stage: 'Replica',
      };
    }
  } catch (error) {
    console.error('Failed to getNomadTxStatus', error);
  }
};

export const processNomadMessage = async ({
  homeChainId,
  foreignChainId,
  txHash,
  injectedProvider, // must be connected to the foreign chain
}) => {
  try {
    const homeChainConfig = chainByID(homeChainId);
    const foreignChainConfig = chainByID(foreignChainId);
    const core = new NomadSDK.NomadContext(
      homeChainConfig.zodiac_nomad_module.environment,
    );
    nomadRegisterRpcProvider(
      core,
      homeChainConfig.network,
      homeChainConfig.rpc_url,
    );
    nomadRegisterRpcProvider(
      core,
      foreignChainConfig.network,
      foreignChainConfig.rpc_url,
    );
    const messages = await getNomadMessages(
      core,
      homeChainConfig.network,
      txHash,
    );
    const nomadMessage = messages.length && messages[0];
    const nomadStatus = await nomadMessage.events(); // { status, events }
    if (nomadStatus.status !== NomadSDK.MessageStatus.Relayed) return false;

    const provider = new ethers.providers.Web3Provider(
      injectedProvider.currentProvider,
    );
    core.registerSigner(
      foreignChainConfig.network === 'mainnet'
        ? 'ethereum'
        : foreignChainConfig.network,
      provider.getSigner(),
    );
    const tx = await core.process(nomadMessage);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Failed to processNomadMessage', error);
  }
};

export const getAvailableCrossChainIds = (boostId, chainId, minionType) => {
  if (
    boostId === BOOSTS.CROSS_CHAIN_MINION.id ||
    minionType === MINION_TYPES.CROSSCHAIN_SAFE
  ) {
    return {
      zodiacModule: 'ambModule',
      availableNetworks: chainByID(chainId).zodiac_amb_module?.foreign_networks,
    };
  }
  if (
    boostId === BOOSTS.CROSS_CHAIN_MINION_NOMAD.id ||
    minionType === MINION_TYPES.CROSSCHAIN_SAFE_NOMAD
  ) {
    return {
      zodiacModule: 'nomadModule',
      availableNetworks: chainByID(chainId).zodiac_nomad_module
        ?.foreign_networks,
    };
  }
};

export const encodeSafeSignMessage = (chainId, message) => {
  const config = chainByID(chainId).safeMinion;
  if (config.safe_sign_lib_addr) {
    const abi = getLocalABI(CONTRACTS.LOCAL_SAFE_SIGNLIB);
    const signMessageFn = abi.find(
      ({ type, name }) => type === 'function' && name === 'signMessage',
    );
    const web3 = new Web3();
    const data = web3.eth.abi.encodeFunctionCall(signMessageFn, [message]);
    return {
      to: config.safe_sign_lib_addr,
      data,
      value: '0',
      operation: '1',
    };
  }
};
