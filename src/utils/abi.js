import { encodeMultiSend } from '@gnosis.pm/safe-contracts';
import Web3 from 'web3';
import { Contract, BigNumber, utils as EthersUtils } from 'ethers';

import { chainByID } from './chain';
import { createContract } from './contract';
import { IsJsonString } from './general';

import DAO_CONDITIONAL_HELPER from '../contracts/daoConditionalHelper.json';
import ERC_20 from '../contracts/erc20a.json';
import ERC_721 from '../contracts/nft.json';
import ERC_1155 from '../contracts/erc1155.json';
import ERC_1155_METADATA from '../contracts/erc1155MetadataUri.json';
import GNOSIS_IPROXY from '../contracts/iProxy.json';
import MOLOCH_V2 from '../contracts/molochV2.json';
import NIFTY_INK from '../contracts/niftyInk.json';
import NIFTY_MINION_FACTORY from '../contracts/minionNiftyFactory.json';
import NIFTY_MINION from '../contracts/minionNifty.json';
import SAFE_MINION from '../contracts/safeMinion.json';
import SAFE_MINION_V2 from '../contracts/safeMinionV2.json';
import SAFE_MINION_FACTORY from '../contracts/safeMinionFactory.json';
import SAFE_MULTISEND from '../contracts/safeMultisend.json';
import SAFE_SIGNLIB from '../contracts/safeSignMessageLib.json';
import SUPERFLUID_MINION from '../contracts/superfluidMinion.json';
import SUPERFLUID_MINION_FACTORY from '../contracts/superfluidMinionFactory.json';
import VANILLA_MINION from '../contracts/minion.json';
import VANILLA_MINION_FACTORY from '../contracts/minionFactory.json';
import WRAP_N_ZAP_FACTORY from '../contracts/wrapNZapFactory.json';
import WRAP_N_ZAP from '../contracts/wrapNZap.json';
import ESCROW_MINION from '../contracts/escrowMinion.json';
import POSTER from '../contracts/poster.json';
import DISPERSE_APP from '../contracts/disperseApp.json';
import SWAPR_STAKING from '../contracts/swapr_staking.json';
import { MINION_TYPES } from './proposalUtils';
import SF_CFA from '../contracts/superfluidCFA.json';
import SF_HOST from '../contracts/superfluid.json';
import SF_SETH from '../contracts/superfluidSETHProxy.json';
import SF_SUPERTOKEN from '../contracts/superfluidSupertoken.json';
import SF_SUPERTOKEN_FACTORY from '../contracts/superfluidTokenFactory.json';
import AMB_MODULE from '../contracts/ambModule.json';
import AMB from '../contracts/iAmb.json';
import SF_UUPS_PROXIABLE from '../contracts/uupsProxiable.json';
import NATIVE_WRAPPER from '../contracts/nativeWrapper.json';
import MOLOCH_TOKEN_FACTORY from '../contracts/molochTokenFactory.json';
import SBT_FACTORY from '../contracts/sbtFactory.json';
import HEDGEY_BATCH_MINT from '../contracts/hedgeyBatchMint.json';
import NOMAD_MODULE from '../contracts/nomadModule.json';
import NOMAD_HOME from '../contracts/nomadHome.json';
import { validate } from './validation';

import { cacheABI, getCachedABI } from './localForage';

export const LOCAL_ABI = Object.freeze({
  MOLOCH_V2,
  ERC_20,
  VANILLA_MINION,
  NIFTY_MINION,
  ERC_721,
  ERC_1155,
  ERC_1155_METADATA,
  NIFTY_INK,
  SUPERFLUID_MINION,
  SUPERFLUID_MINION_FACTORY,
  SAFE_MINION_FACTORY,
  SAFE_MINION,
  SAFE_MINION_V2,
  SAFE_MULTISEND,
  SAFE_SIGNLIB,
  VANILLA_MINION_FACTORY,
  NIFTY_MINION_FACTORY,
  WRAP_N_ZAP_FACTORY,
  WRAP_N_ZAP,
  DAO_CONDITIONAL_HELPER,
  ESCROW_MINION,
  DISPERSE_APP,
  SF_CFA,
  SF_HOST,
  SF_SETH,
  SF_SUPERTOKEN,
  SF_SUPERTOKEN_FACTORY,
  SWAPR_STAKING,
  POSTER,
  AMB_MODULE,
  AMB,
  NATIVE_WRAPPER,
  MOLOCH_TOKEN_FACTORY,
  SBT_FACTORY,
  HEDGEY_BATCH_MINT,
  NOMAD_MODULE,
  NOMAD_HOME,
});

const getBlockExplorerApiKey = chainID => {
  switch (chainID) {
    case '0x89': {
      return process.env.REACT_APP_POLYGONSCAN_KEY;
    }
    case '0x64': {
      return null;
    }
    default: {
      return process.env.REACT_APP_ETHERSCAN_KEY;
    }
  }
};

const getABIurl = (contractAddress, chainID) => {
  const key = getBlockExplorerApiKey(chainID);
  return key
    ? `${chainByID(chainID).abi_api_url}${contractAddress}&apiKey=${key}`
    : `${chainByID(chainID).abi_api_url}${contractAddress}`;
};

export const isProxyABI = response => {
  if (response?.length) {
    return response.some(fn => fn.name === 'implementation');
  }
};

export const isBeaconProxyABI = response => {
  return (
    response.length == 3 &&
    response.some(
      fn =>
        fn.type === 'constructor' &&
        fn.inputs?.some(i => i.name === '_upgradeBeacon'),
    )
  );
};

const isGnosisProxy = response => {
  return (
    response.length === 2 &&
    response.every(fn => ['constructor', 'fallback'].includes(fn.type)) &&
    response
      .find(fn => fn.type === 'constructor')
      ?.['inputs']?.every?.(
        // singleton param from IProxy or GnosisSafeProxy
        input => ['_masterCopy', '_singleton'].includes(input.name),
      )
  );
};

const isSuperfluidProxy = response => {
  return (
    response.length === 3 && response.some(fn => fn.name === 'initializeProxy')
  );
};

const getImplementationOf = async (address, chainID, abi) => {
  const web3Contract = createContract({ address, abi, chainID });
  const newAddress = await web3Contract.methods.implementation().call();
  return newAddress;
};

const getGnosisMasterCopy = async (address, chainID) => {
  try {
    const web3Contract = createContract({
      abi: GNOSIS_IPROXY,
      address,
      chainID,
    });
    const masterCopy = await web3Contract.methods.masterCopy().call();
    return masterCopy;
  } catch (error) {
    console.log('Failed to fetch masterCopy from Proxy');
  }
};

const processABI = async ({
  abi,
  fetchABI,
  contractAddress,
  chainID,
  parseJSON,
}) => {
  if (isProxyABI(abi)) {
    const proxyAddress = await getImplementationOf(
      contractAddress,
      chainID,
      abi,
    );
    const newData = await fetchABI(proxyAddress, chainID, parseJSON);
    return newData;
  }
  if (isBeaconProxyABI(abi)) {
    const contractDetails = await fetchContractCode(contractAddress, chainID);
    const implAddress =
      contractDetails['Implementation'] ||
      contractDetails['ImplementationAddress'];
    if (implAddress) {
      const newData = await fetchABI(implAddress, chainID, parseJSON);
      return newData;
    }
    return abi;
  }
  if (isSuperfluidProxy(abi)) {
    const proxy = createContract({
      address: contractAddress,
      abi: SF_UUPS_PROXIABLE,
      chainID,
    });
    const proxyAddress = await proxy.methods.getCodeAddress().call();
    const newData = await fetchABI(proxyAddress, chainID, parseJSON);
    return newData;
  }
  if (isGnosisProxy(abi)) {
    const gnosisProxy = await getGnosisMasterCopy(contractAddress, chainID);
    if (!gnosisProxy) {
      // used the new GnosisSafeProxy (no public getter)
      const contractDetails = await fetchContractCode(contractAddress, chainID);
      const implAddress =
        contractDetails['Implementation'] ||
        contractDetails['ImplementationAddress'];
      if (implAddress) {
        const newData = await fetchABI(implAddress, chainID, parseJSON);
        return newData;
      }
      return; // TODO: should not happen
    }
    const newData = await fetchABI(gnosisProxy, chainID, parseJSON);
    return newData;
  }
  return abi;
};

export const fetchABI = async (contractAddress, chainID, parseJSON = true) => {
  const cachedABI = await getCachedABI({ contractAddress, chainID });

  if (cachedABI) {
    const processedABI = await processABI({
      abi: cachedABI,
      fetchABI,
      contractAddress,
      chainID,
      parseJSON,
    });

    return processedABI;
  }
  const url = getABIurl(contractAddress, chainID);
  if (!url) {
    throw new Error('Could generate ABI link with the given arguments');
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.message === 'OK' && IsJsonString(data?.result) && parseJSON) {
      const abi = JSON.parse(data.result);
      cacheABI({
        contractAddress,
        chainID,
        abi,
      });
      const processedABI = await processABI({
        abi,
        fetchABI,
        contractAddress,
        chainID,
        parseJSON,
      });
      return processedABI;
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchContractCode = async (
  contractAddress,
  chainID,
  parseJSON = true,
) => {
  const baseURI = `
    ${
      chainByID(chainID).tokenlist_api_url
    }?module=contract&action=getsourcecode&address=${contractAddress}`;
  const key = getBlockExplorerApiKey(chainID);
  const url = key ? `${baseURI}&apiKey=${key}` : baseURI;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.message === 'OK' && parseJSON) return data.result[0];
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getABIfunctions = abi => {
  if (!abi || !Array.isArray(abi) || !abi.length) return null;
  return abi.filter(({ type, constant }) => type === 'function' && !constant);
};

export const formatFNsAsSelectOptions = abi => {
  if (!abi || !Array.isArray(abi) || !abi.length) return null;
  return abi.map(fn => ({
    name: fn.name,
    value: JSON.stringify(fn),
    key: fn.name,
  }));
};

export const safeEncodeHexFunction = (selectedFunction, inputVals) => {
  console.log('selectedFunction', selectedFunction);
  console.log('inputVals', inputVals);
  if (!selectedFunction || !Array.isArray(inputVals))
    throw new Error(
      'Incorrect params passed to safeEncodeHexFunction in abi.js',
    );
  try {
    const web3 = new Web3();
    return web3.eth.abi.encodeFunctionCall(selectedFunction, inputVals);
  } catch (error) {
    return {
      encodingError: true,
      message:
        'Could not encode transaction data with the values entered into this form',
    };
  }
};

export const ensureHex = (abiInput, abiArgs) => {
  return validate.hex(abiInput)
    ? abiInput
    : safeEncodeHexFunction(JSON.parse(abiInput), abiArgs || []);
};

export const encodeMultisendTx = (
  multiSendFn,
  tos,
  values,
  actions,
  operations,
) => {
  if (
    tos.length + values.length + actions.length + operations.length ===
    tos.length * 4
  ) {
    const metaTransactions = actions.map((action, idx) => {
      return {
        to: tos[idx],
        value: values[idx],
        data: action,
        operation: operations[idx],
      };
    });
    const encodedMetatransactions = encodeMultiSend(metaTransactions);
    const web3 = new Web3();
    return web3.eth.abi.encodeFunctionCall(multiSendFn, [
      encodedMetatransactions,
    ]);
  }
  return {
    encodingError: true,
    message: 'Multisend params length mismatch',
  };
};

export const decodeMultisendTx = (multisendAddress, encodedTx) => {
  const OPERATION_TYPE = 2;
  const ADDRESS = 40;
  const VALUE = 64;
  const DATA_LENGTH = 64;

  const multisend = new Contract(multisendAddress, SAFE_MULTISEND);
  const actions = multisend.interface.decodeFunctionData(
    'multiSend',
    encodedTx,
  );
  let transactionsEncoded = actions[0].slice(2);

  const transactions = [];

  while (
    transactionsEncoded.length >=
    OPERATION_TYPE + ADDRESS + VALUE + DATA_LENGTH
  ) {
    const thisTxLengthHex = transactionsEncoded.slice(
      OPERATION_TYPE + ADDRESS + VALUE,
      OPERATION_TYPE + ADDRESS + VALUE + DATA_LENGTH,
    );
    const thisTxLength = BigNumber.from(`0x${thisTxLengthHex}`).toNumber();
    transactions.push({
      to: `0x${transactionsEncoded.slice(2, OPERATION_TYPE + ADDRESS)}`,
      value: `0x${transactionsEncoded.slice(
        OPERATION_TYPE + ADDRESS,
        OPERATION_TYPE + ADDRESS + VALUE,
      )}`,
      data: `0x${transactionsEncoded.slice(
        OPERATION_TYPE + ADDRESS + VALUE + DATA_LENGTH,
        OPERATION_TYPE + ADDRESS + VALUE + DATA_LENGTH + thisTxLength * 2,
      )}`,
      operation: parseInt(transactionsEncoded.slice(0, 2)),
    });
    transactionsEncoded = transactionsEncoded.slice(
      OPERATION_TYPE + ADDRESS + VALUE + DATA_LENGTH + thisTxLength * 2,
    );
  }

  return transactions;
};

export const decodeAMBTx = (ambModuleAddress, encodedTx) => {
  const ambModule = new Contract(ambModuleAddress, AMB_MODULE);
  return ambModule.interface.decodeFunctionData(
    'executeTransaction',
    encodedTx,
  );
};

export const decodeNomadTx = (recipientAddress, messageBody) => {
  const nomadModuleAddress = `0x${recipientAddress.substring(
    recipientAddress.length - 40,
    recipientAddress.length,
  )}`;
  const [to, , data] = EthersUtils.defaultAbiCoder.decode(
    ['address', 'uint256', 'bytes', 'uint8'],
    messageBody,
  );
  return { to, data, nomadModuleAddress };
};

export const getLocalABI = contract => LOCAL_ABI[contract.abiName];
const getLocalSnippet = ({ contract, fnName }) => {
  const abi = getLocalABI(contract);
  const snippet = abi?.find(fn => fn.name === fnName);
  return snippet;
};

export const getRemoteABI = async (contract, data) => {
  const chainID = data.contextData.daochain;
  const abi = await fetchABI(contract.contractAddress, chainID);
  return abi;
};
const getRemoteSnippet = async ({ contract, fnName }, data) => {
  const remoteSnippet = await getRemoteABI(contract, data)?.find(
    fn => fn.name === fnName,
  );
  return remoteSnippet;
};

export const getABIsnippet = (params, data) => {
  const { contract } = params;
  if (contract.location === 'local') return getLocalSnippet(params);
  if (contract.location === 'fetch') return getRemoteSnippet(params, data);
  if (contract.location === 'static') return contract.value;
  throw new Error(
    `abi.js => getABIsnippet():
     Did not recieve a correct ABI snippet location. Check tx data in contractTx.js`,
  );
};
export const getContractABI = async data => {
  const { contract } = data.tx;

  console.log('contract', contract);
  if (contract.location === 'local') return getLocalABI(contract);
  if (contract.location === 'fetch') return getRemoteABI(contract, data);
  if (contract.location === 'static') return contract.value;
  throw new Error(
    `abi.js => getABI():
    Did not recieve a correct ABI location. Check tx data in contractTx.js`,
  );
};

export const getMinionAbi = (minionType, version = '1') => {
  const minionTypeVersion = `${minionType}_${version}`;
  const abis = {
    [`${MINION_TYPES.NIFTY}_1`]: NIFTY_MINION,
    [`${MINION_TYPES.VANILLA}_1`]: VANILLA_MINION,
    [`${MINION_TYPES.SAFE}_1`]: SAFE_MINION,
    [`${MINION_TYPES.SAFE}_2`]: SAFE_MINION_V2,
    [`${MINION_TYPES.SUPERFLUID}_1`]: SUPERFLUID_MINION,
  };
  if (Object.keys(abis).includes(minionTypeVersion)) {
    return abis[minionTypeVersion];
  }
  return null;
};
