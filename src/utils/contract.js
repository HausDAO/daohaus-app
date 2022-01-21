// SAVE FOR LATER
import { ethers } from 'ethers';
import { encodeMulti, encodeSingle, TransactionType } from 'ethers-multisend';
import SafeMasterCopy from '@gnosis.pm/safe-contracts/build/artifacts/contracts/GnosisSafe.sol/GnosisSafe.json';
import { deployAndSetUpModule } from '@gnosis.pm/zodiac';
import Web3 from 'web3';

// import Erc20Abi from '../contracts/erc20a.json';
import { getLocalABI } from './abi';
import { chainByID } from './chain';
import { getApiGnosis, postApiGnosis, postGnosisRelayApi } from './requests';
import { CONTRACTS } from '../data/contractTX';

export const createContract = ({ address, abi, chainID, web3 }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  return new web3.eth.Contract(abi, address);
};

// const compareAttributes = (comparisonType, { contract, abi }) => {
//   console.log(contract);
//   console.log(abi);
//   // if(comparisonType === 'ABI=>Contract' ){
//   //   const abiKeys = abi.filter(fn => fn.type==='function').map(fn => fn.name)
//   //   const
//   // }
// };

// export const checkContractType = ({ contractType, address, chainID }) => {
//   // check if there's a local ABI

//   if (!contractType || !address || chainID) {
//     console.log(`contractType`, contractType);
//     console.log(`address`, address);
//     console.log(`chainID`, chainID);
//     throw new Error(
//       'Did not recieve the correct params for checkContractType() in contract.js ',
//     );
//   }
//   const localABIs = {
//     erc20: Erc20Abi,
//     //  Add as needed
//   };

//   if (localABIs[contractType]) {
//     const abi = localABIs[erc20];
//     const contract = createContract({ address, chainID, abi });
//     const isContractType = compareAttributes('ABI=>Contract', {
//       contract,
//       abi,
//     });
//   }
//   // create an list of methonds from the localABI
//   // for every item on the list, check to make sure the contract has all of these items on the list.
// };

// const test = () => {
//   checkContractType('');
// };

// test();

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
  const safeDetails = await getApiGnosis(networkName, `safes/${safeAddress}/`);
  const gasEstimate =
    ['mainnnet', 'rinkeby', 'goerli'].includes(networkName) &&
    (await postGnosisRelayApi(
      networkName,
      `safes/${safeAddress}/transactions/estimate/`,
      txBase,
    ));

  // TODO: consider Txs in the queue?
  const { nonce } = safeDetails;
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

export const getNftUri = async (
  daochain,
  injectedProvider,
  contractAbi,
  getterName,
  contractAddress,
  tokenId,
) => {
  try {
    const contract = await createContract({
      address: contractAddress,
      abi: contractAbi,
      chainID: daochain,
      web3: injectedProvider,
    });
    return await contract.methods[getterName](tokenId).call();
  } catch (error) {
    console.error('Error trying to fetch URI using', getterName, error);
  }
};

export const getNftType = async (
  daochain,
  injectedProvider,
  contractAddress,
  tokenId,
) => {
  const erc721Uri = await getNftUri(
    daochain,
    injectedProvider,
    getLocalABI(CONTRACTS.LOCAL_ERC_721),
    'tokenURI',
    contractAddress,
    tokenId,
  );
  if (erc721Uri) return 'ERC721';
  const erc1155Uri = await getNftUri(
    daochain,
    injectedProvider,
    getLocalABI(CONTRACTS.LOCAL_ERC_1155_METADATA),
    'uri',
    contractAddress,
    tokenId,
  );
  if (erc1155Uri) return 'ERC1155';
  throw new Error('Not an NFT');
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
    return props.every(v => v);
  } catch (error) {
    console.error('Not an AMB module', address, error);
    return false;
  }
};

export const fetchSafeOwners = async (chainID, safeAddress) => {
  const safe = createContract({
    address: safeAddress,
    abi: SafeMasterCopy.abi,
    chainID,
  });
  return safe.methods.getOwners().call();
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
    const currentOwners = await fetchSafeOwners(chainID, safeAddress);
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
    const encodedTx = encodeMulti(txs, config.safe_mutisend_addr);
    return encodedTx;
  } catch (error) {
    console.error('An error occurred while trying to encode Txs', error);
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
