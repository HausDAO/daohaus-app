import Web3 from 'web3';
import { chainByID } from './chain';
import { createContract } from './contract';
import { IsJsonString } from './general';

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
