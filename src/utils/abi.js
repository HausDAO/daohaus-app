import Web3 from 'web3';

import { chainByID } from './chain';
import { createContract } from './contract';
import { IsJsonString } from './general';

import MOLOCH_V2 from '../contracts/molochV2.json';
import ERC_20 from '../contracts/erc20a.json';
import VANILLA_MINION from '../contracts/minion.json';
import ERC_721 from '../contracts/nft.json';
import NIFTY_INK from '../contracts/niftyInk.json';
import UBERHAUS_MINION from '../contracts/uberHausMinion.json';
import SUPERFLUID_MINION from '../contracts/superfluidMinion.json';
import NIFTY_MINION from '../contracts/minionNifty.json';
import WRAP_N_ZAP_FACTORY from '../contracts/wrapNZapFactory.json';
import WRAP_N_ZAP from '../contracts/wrapNZap.json';

export const LOCAL_ABI = Object.freeze({
  MOLOCH_V2,
  ERC_20,
  VANILLA_MINION,
  ERC_721,
  NIFTY_INK,
  UBERHAUS_MINION,
  SUPERFLUID_MINION,
  NIFTY_MINION,
  WRAP_N_ZAP_FACTORY,
  WRAP_N_ZAP,
});

const isEtherScan = chainID => {
  if (chainID === '0x1' || chainID === '0x4' || chainID === '0x2a') {
    return true;
  }
  return false;
};
const isPolygonScan = chainID => {
  if (chainID === '0x84') {
    return true;
  }
  return false;
};
const getABIurl = (contractAddress, chainID) => {
  const key = isEtherScan(chainID)
    ? process.env.REACT_APP_ETHERSCAN_KEY
    : isPolygonScan(chainID)
    ? 'EM7G9BPWRFTG9F9GVEEJMS917NJ2WVT8ZS'
    : null;
  return key
    ? `${chainByID(chainID).abi_api_url}${contractAddress}&apiKey=${key}`
    : `${chainByID(chainID).abi_api_url}${contractAddress}`;
};

const isProxyABI = response => {
  if (response?.length) {
    return response.some(fn => fn.name === 'implementation');
  }
};

const getImplementationOf = async (address, chainID, abi) => {
  const web3Contract = createContract({ address, abi, chainID });
  const newAddress = await web3Contract.methods.implementation().call();
  return newAddress;
};

export const fetchABI = async (contractAddress, chainID, parseJSON = true) => {
  const url = getABIurl(contractAddress, chainID);
  if (!url) {
    throw new Error('Could generate ABI link with the given arguments');
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.message === 'OK' && IsJsonString(data?.result) && parseJSON) {
      const abiData = JSON.parse(data.result);
      if (isProxyABI(abiData)) {
        const originalAddress = await getImplementationOf(
          contractAddress,
          chainID,
          abiData,
        );
        const newData = await fetchABI(originalAddress, chainID, parseJSON);
        return newData;
      }
      return abiData;
    }
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

export const paramsToProposalForm = abiInputs => {
  if (!abiInputs || !Array.isArray(abiInputs)) return null;

  return abiInputs.map(input => ({
    type: 'input',
    label: input.name,
    name: `*abiInput*${input.name}`,
    htmlFor: `*abiInput*${input.name}`,
    placeholder: input.type,
    expectType: 'any',
  }));
};

export const safeEncodeHexFunction = (selectedFunction, inputVals) => {
  console.log(`selectedFunction`, selectedFunction);
  console.log(`inputVals`, inputVals);
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

export const getLocalABI = contract => LOCAL_ABI[contract.abiName];
const getLocalSnippet = ({ contract, fnName }) => {
  console.log(`contract`, contract);
  const abi = getLocalABI(contract);
  console.log(`abi`, abi);
  const snippet = abi?.find(fn => fn.name === fnName);
  console.log(`snippet`, snippet);
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
