import { chainByID } from './chain';
import { fetchABI } from './abi';

export const CONTRACT_MODELS = {
  //  SRC https://ethereum.org/en/developers/docs/standards/tokens/erc-20/
  ERC20: {
    name: 'ERC-20',
    model: [
      'name',
      'symbol',
      'decimals',
      'totalSupply',
      'balanceOf',
      'transfer',
      'transferFrom',
      'approve',
      'allowance',
    ],
  },
  // SRC https://ethereum.org/en/developers/docs/standards/tokens/erc-721/
  ERC721: {
    name: 'ERC-721',
    model: [
      'balanceOf',
      'ownerOf',
      'safeTransferFrom',
      'transferFrom',
      'approve',
      'setApprovalForAll',
      'getApproved',
      'isApprovedForAll',
    ],
  },
  // SRC https://github.com/gnosis/safe-contracts/blob/v1.3.0/contracts/GnosisSafe.sol
  GNOSIS_SAFE: {
    name: 'GnosisSafe',
    model: [
      'setup',
      'execTransaction',
      'requiredTxGas',
      'approveHash',
      'domainSeparator',
      'encodeTransactionData',
      'getTransactionHash',
      'enableModule',
      'disableModule',
      'execTransactionFromModule',
      'execTransactionFromModuleReturnData',
    ],
  },
};

const fetchEtherscanAPIData = async (address, daochain, module) => {
  try {
    let key;
    if (daochain === '0x89') {
      key = process.env.REACT_APP_POLYGONSCAN_KEY;
    } else {
      key = process.env.REACT_APP_ETHERSCAN_KEY;
    }
    const url = `${
      chainByID(daochain).tokenlist_api_url
    }${module}${address}${key && `&apikey=${key}`}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!json.result || json.status === '0') {
      const msg = json.result;
      console.warn('error', msg);
      return null;
    }
    return json.result;
  } catch (error) {
    return null;
  }
};

const fetchBlockScoutAPIData = async (address, module) => {
  try {
    const daochain = '0x64';

    const url = `${chainByID(daochain).tokenlist_api_url}${module}${address}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!json.result || json.status === '0') {
      const msg = json.message;
      throw new Error(msg);
    }
    return json.result;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchNativeBalance = async (address, daochain) => {
  if (
    daochain === '0x1' ||
    daochain === '0x5' ||
    daochain === '0xa' ||
    daochain === '0x89' ||
    daochain === '0xa4b1'
  ) {
    try {
      const json = await fetchEtherscanAPIData(
        address,
        daochain,
        '?module=account&action=balance&address=',
      );

      return json;
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const json = await fetchBlockScoutAPIData(
        address,
        '?module=account&action=balance&address=',
      );

      return json;
    } catch (error) {
      console.error(error);
    }
  }
};

export const fetchTokenTransferHistory = async (
  daochain,
  address,
  startBlock,
  tokenAddress,
  page = 1,
  offset = 100,
) => {
  const moduleParams = `?module=account&action=tokentx&contractaddress=${tokenAddress}&startblock=${startBlock}&page=${page}&offset=${offset}&address=`;
  if (daochain === '0x1' || daochain === '0x89' || daochain === '0xa4b1') {
    try {
      const json = await fetchEtherscanAPIData(address, daochain, moduleParams);
      return json;
    } catch (error) {
      throw new Error(error);
    }
  } else {
    try {
      const json = await fetchBlockScoutAPIData(address, moduleParams);
      return json;
    } catch (error) {
      throw new Error(error);
    }
  }
};

export const getExplorerLink = (tokenAddress, chainID) => {
  const slugStart = chainByID(chainID)?.block_explorer;
  if (chainID === '0x1' || chainID === '0x5') {
    return `${slugStart}/token/${tokenAddress}`;
  }
  if (chainID === '0x64' || chainID === '0x89') {
    return `${slugStart}/tokens/${tokenAddress}`;
  }
  return null;
};

export const checkContractType = async (address, chainID, model) => {
  const abi = await fetchABI(address, chainID);
  if (!abi || ['0', '1'].includes(abi.status)) {
    console.log('Failed to fetch contract ABI', abi);
    return false;
  }
  const names = abi.filter(fn => fn.name).map(fn => fn.name);

  return model.every(name => names.includes(name));
};
