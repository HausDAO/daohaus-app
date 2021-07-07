import Web3 from 'web3';

import { chainByID } from './chain';
import { createContract } from './contract';
import { IsJsonString } from './general';

import MOLOCH_V2 from '../contracts/molochV2.json';
import ERC_20 from '../contracts/erc20a.json';
import VANILLA_MINION from '../contracts/nft.json';
import ERC_721 from '../contracts/minion.json';

export const LOCAL_ABI = Object.freeze({
  MOLOCH_V2,
  ERC_20,
  VANILLA_MINION,
  ERC_721,
});

const isEtherScan = chainID => {
  if (chainID === '0x1' || chainID === '0x4' || chainID === '0x2a') {
    return true;
  }
  return false;
};
const getABIurl = (contractAddress, chainID) => {
  const key = isEtherScan(chainID) ? process.env.REACT_APP_ETHERSCAN_KEY : null;
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

const getLocalSnippet = params =>
  LOCAL_ABI[params.abiName].find(fn => fn.name === params.fnName);

const getRemoteSnippet = async (params, data) => {
  const chainID = data.contextData.daochain;
  const abi = await fetchABI(params.contractAddress, chainID);
  return abi.find(fn => fn.name === params.fnName);
};

export const getABIsnippet = (params, data) => {
  if (params.type === 'local') return getLocalSnippet(params);
  if (params.type === 'fetch') return getRemoteSnippet(params, data);
  if (params.type === 'static') return params.value;
  throw new Error(
    'Did not recieve a correct ABI snippet type. Check tx data in contractTx.js',
  );
};
