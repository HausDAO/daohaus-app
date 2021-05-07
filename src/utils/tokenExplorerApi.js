import { NFTService } from '../services/nftService';
import { chainByID } from './chain';
import { fetchTokenData } from './tokenValue';

const fetchEtherscanAPIData = async (address, daochain) => {
  try {
    const key = process.env.REACT_APP_ETHERSCAN_KEY;
    const url = `${chainByID(daochain).tokenlist_api_url}${address}${key &&
      `&apikey=${key}`}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!json.result || json.status === '0') {
      const msg = json.result;
      throw new Error(msg);
    }
    return json.result;
  } catch (error) {
    throw new Error(error);
  }
};

const parseEtherscan = async (json, address, daochain) => {
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

        return {
          contractAddress: key,
          balance: totalBalance,
          tokenName: value[0].tokenName,
          type: 'ERC-721',
          decimals: value[0].tokenDecimal,
          symbol: value[0].tokenSymbol,
        };
      },
    );

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
  }
};

export const getEtherscanTokenData = async (address, daochain) => {
  const json = await fetchEtherscanAPIData(address, daochain);
  const tokenData = parseEtherscan(json, address, daochain);
  return tokenData;
};

const fetchBlockScoutAPIData = async address => {
  try {
    const daochain = '0x64';
    const url = `${chainByID(daochain).tokenlist_api_url}${address}`;
    console.log('url', url);
    const response = await fetch(url);
    const json = await response.json();
    if (!json.result || json.status === '0') {
      const msg = json.message;
      throw new Error(msg);
    }
    return json;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchNativeBalance = async (address, daochain) => {
  if (daochain === '0x1' || daochain === '0x4' || daochain === '0x2a') {
    // eth chains not supported yet
    // may need to do something different for matic too
  } else {
    try {
      const url = `https://blockscout.com/xdai/mainnet/api?module=account&action=balance&address=${address}`;
      const response = await fetch(url);
      const json = await response.json();
      if (!json.result || json.status === '0') {
        const msg = json.message;
        throw new Error(msg);
      }
      return json;
    } catch (error) {
      throw new Error(error);
    }
  }
};
const parseBlockScout = async (json, address) => {
  const tokenData = await fetchTokenData();
  const daochain = '0x64';

  let erc721s = json.result
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
  const erc20s = json.result
    .filter(token => token.type === 'ERC-20')
    .sort((a, b) => b.balance - a.balance)
    .map(t => {
      const usd = tokenData[t.contractAddress.toLowerCase()]?.price || 0;
      const totalUSD = parseFloat(+t.balance / 10 ** +t.decimals) * +usd;
      return { ...t, ...{ usd, totalUSD } };
    });
  console.log('erc20s', erc20s);
  console.log('erc721s', erc721s);
  return [...erc20s, ...erc721s];
};

export const getBlockScoutTokenData = async address => {
  const json = await fetchBlockScoutAPIData(address);
  console.log('results', json.result);

  const tokenData = parseBlockScout(json, address);
  return tokenData;
};
