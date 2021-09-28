import { NFTService } from '../services/nftService';
import { fetchABI } from './abi';
import { chainByID } from './chain';
import { fetchTokenData } from './tokenValue';

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
      'checkSignatures',
      'checkNSignatures',
      'requiredTxGas',
      'approveHash',
      'domainSeparator',
      'encodeTransactionData',
      'getTransactionHash',
      'enableModule',
      'disableModule',
      'execTransactionFromModule',
      'execTransactionFromModuleReturnData',
      'isModuleEnabled',
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

const parseEtherscan = async (json, address, type) => {
  const tokenData = await fetchTokenData();
  if (json) {
    const contractAddressObj = json.reduce((acc, transaction) => {
      (acc[transaction.contractAddress] =
        acc[transaction.contractAddress] || []).push(transaction);
      return acc;
    }, {});
    const balanceData = Object.entries(contractAddressObj).map(
      ([key, value]) => {
        const totalBalance = value.reduce((acc, transaction) => {
          if (transaction.from === address) {
            acc -= parseInt(transaction.value || '1', 10);
          } else acc += parseInt(transaction.value || '1', 10);
          return acc;
        }, 0);

        const usd = tokenData[key]?.price || 0;
        const totalUSD =
          parseFloat(+totalBalance / 10 ** +value[0].tokenDecimal) * +usd;

        return {
          contractAddress: key,
          balance: totalBalance,
          tokenName: value[0].tokenName,
          type,
          decimals: value[0].tokenDecimal,
          symbol: value[0].tokenSymbol,
          usd,
          totalUSD,
        };
      },
    );

    console.log('balanceData', balanceData);
    return balanceData;
  }
};

export const fetchNFTMetaData = async (balanceData, address, daochain) => {
  if (!balanceData) {
    return [];
  }
  let erc721s = balanceData
    .filter(token => token.type === 'ERC-721')
    .map(async b => {
      const promises = [];
      const nftService = NFTService({
        tokenAddress: b.contractAddress,
        chainID: daochain,
      });

      for (let i = 0; i < b.balance; i += 1) {
        const tid = nftService('tokenOfOwnerByIndex')({
          accountAddr: address,
          index: i,
        });
        promises.push(tid);
      }
      b.tokenIds = await Promise.all(promises);
      return b;
    });
  erc721s = await Promise.all(erc721s);

  erc721s.map(async nft => {
    const promises2 = [];
    const nftService = NFTService({
      tokenAddress: nft.contractAddress,
      chainID: daochain,
    });
    nft.tokenIds.map(tid => {
      if (tid) {
        const uri = nftService('tokenURI')({
          tokenId: tid,
        });
        promises2.push(uri);
      } else {
        promises2.push(Promise.resolve());
      }
      return null;
    });
    nft.tokenURIs = await Promise.all(promises2);
    return nft;
  });
  erc721s = await Promise.all(erc721s);
  return erc721s;
};

export const getEtherscanTokenData = async (address, daochain) => {
  const erc20Json = await fetchEtherscanAPIData(
    address,
    daochain,
    '?module=account&action=tokentx&address=',
  );
  const erc721Json = await fetchEtherscanAPIData(
    address,
    daochain,
    '?module=account&action=tokennfttx&address=',
  );

  console.log('erc721Json', erc721Json);
  console.log('erc20Json', erc20Json);

  let erc20tokenData = [];
  if (erc20Json) {
    erc20tokenData = (await parseEtherscan(erc20Json, address, 'ERC-20')) || [];
  }
  let erc721tokenData = [];
  let erc721withMeta = [];
  if (erc721Json) {
    erc721tokenData =
      (await parseEtherscan(erc721Json, address, 'ERC-721')) || [];
    erc721withMeta =
      (await fetchNFTMetaData(erc721tokenData, address, daochain)) || [];
  }
  return [...erc20tokenData, ...erc721withMeta];
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
    daochain === '0x4' ||
    daochain === '0x2a' ||
    daochain === '0x89'
  ) {
    try {
      const json = await fetchEtherscanAPIData(
        address,
        daochain,
        '?module=account&action=balance&address=',
      );

      return json;
    } catch (error) {
      throw new Error(error);
    }
  } else {
    try {
      const json = await fetchBlockScoutAPIData(
        address,
        '?module=account&action=balance&address=',
      );

      return json;
    } catch (error) {
      throw new Error(error);
    }
  }
};
const parseBlockScout = async (json, address) => {
  const tokenData = await fetchTokenData();
  const daochain = '0x64';

  let erc721s = json
    .filter(token => token.type === 'ERC-721')
    .map(async b => {
      const promises = [];
      const nftService = NFTService({
        tokenAddress: b.contractAddress,
        chainID: daochain,
      });

      for (let i = 0; i < +b.balance; i += 1) {
        const tid = nftService('tokenOfOwnerByIndex')({
          accountAddr: address,
          index: i,
        });
        promises.push(tid);
      }
      b.tokenIds = await Promise.all(promises);
      return b;
    });
  erc721s = await Promise.all(erc721s);

  erc721s.map(async nft => {
    const promises2 = [];
    const nftService = NFTService({
      tokenAddress: nft.contractAddress,
      chainID: daochain,
    });
    nft.tokenIds.map(tid => {
      const uri = nftService('tokenURI')({
        tokenId: tid,
      });
      promises2.push(uri);
      return null;
    });
    nft.tokenURIs = await Promise.all(promises2);
    return nft;
  });
  erc721s = await Promise.all(erc721s);
  const erc20s = json
    .filter(token => token.type === 'ERC-20')
    .sort((a, b) => b.balance - a.balance)
    .map(t => {
      const usd = tokenData[t.contractAddress.toLowerCase()]?.price || 0;
      const totalUSD = parseFloat(+t.balance / 10 ** +t.decimals) * +usd;
      return { ...t, ...{ usd, totalUSD } };
    });

  return [...erc20s, ...erc721s];
};

export const getBlockScoutTokenData = async address => {
  const module = '?module=account&action=tokenlist&address=';
  const json = await fetchBlockScoutAPIData(address, module);

  const tokenData = parseBlockScout(json, address);
  return tokenData;
};

export const getExplorerLink = (tokenAddress, chainID) => {
  const slugStart = chainByID(chainID)?.block_explorer;
  if (chainID === '0x1' || chainID === '0x4' || chainID === '0x2a') {
    return `${slugStart}/token/${tokenAddress}`;
  }
  if (chainID === '0x64' || chainID === '0x89') {
    return `${slugStart}/tokens/${tokenAddress}`;
  }
  return null;
};

export const checkContractType = async (address, chainID, model) => {
  const abi = await fetchABI(address, chainID);
  if (!abi || abi.status === '0') {
    console.log('Failed to fetch contract ABI', abi);
    return false;
  }
  const names = abi.filter(fn => fn.name).map(fn => fn.name);
  return model.every(name => names.includes(name));
};

// const test = async tokenType => {
//   console.log(`tokenType`, tokenType);
//   const misfitUniversity = await checkContractType(
//     '0x74a69df3adc7235392374f728601e49807de4b30',
//     '0x1',
//     tokenType,
//   );
//   const spunksNFT = await checkContractType(
//     '0x9a604220d37b69c09effccd2e8475740773e3daf',
//     '0x1',
//     tokenType,
//   );
//   const niftyInk = await checkContractType(
//     '0xc02697c417ddacfbe5edbf23edad956bc883f4fb',
//     '0x1',
//     tokenType,
//   );
//   const dai = await checkContractType(
//     '0x6B175474E89094C44Da98b954EedeAC495271d0F',
//     '0x1',
//     tokenType,
//   );
//   const uni = await checkContractType(
//     '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
//     '0x1',
//     tokenType,
//   );
//   const jordansTestMoloch = await checkContractType(
//     '0x39f002fb6f98111ea6e8b5c157fddec50d18f278',
//     '0x4',
//     tokenType,
//   );
//   const hausOnMainnet = await checkContractType(
//     '0xf2051511B9b121394FA75B8F7d4E7424337af687',
//     '0x1',
//     tokenType,
//   );
//   const hausOnXdai = await checkContractType(
//     '0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb',
//     '0x64',
//     tokenType,
//   );

//   console.log(`misfitUniversity`, misfitUniversity);
//   console.log('spunksNFT', spunksNFT);
//   console.log(`niftyInk`, niftyInk);
//   console.log(`dai`, dai);
//   console.log(`uni`, uni);
//   console.log(`jordansTestMoloch`, jordansTestMoloch);
//   console.log(`hausOnMainnet`, hausOnMainnet);
//   console.log(`hausOnXdai`, hausOnXdai);
// };

// // test(CONTRACT_MODELS.ERC20);
// test(CONTRACT_MODELS.ERC721);
