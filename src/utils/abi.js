import { chainByID } from './chain';
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

export const fetchABI = async (contractAddress, chainID, parseJSON = true) => {
  const url = getABIurl(contractAddress, chainID);
  if (!url) {
    throw new Error('Could generate ABI link with the given arguments');
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.message === 'OK' && IsJsonString(data?.result) && parseJSON) {
      return JSON.parse(data.result);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};
