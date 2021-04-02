import { NFTService } from '../services/nftService';
import { chainByID } from './chain';
import { fetchTokenData } from './tokenValue';

const fetchEtherscanAPIData = async (address, daochain) => {
  try {
    const key = process.env.REACT_APP_ETHERSCAN_KEY;
    const url = `${chainByID(daochain).tokenlist_api_url}${address}${key &&
      '&apikey=' + key}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!json.result || json.status === '0') {
      const msg = json.result;
      throw new Error(msg);
    }
    return json;
  } catch (error) {
    throw new Error(error);
  }
};
const parseEtherscan = async (json, address) => {};
export const getEtherscanTokenData = async (address) => {
  const json = await fetchEtherscanAPIData(address);
  const tokenData = parseEtherscan(json, address);
  return tokenData;
};

const fetchBlockScoutAPIData = async (address) => {
  try {
    const daochain = '0x64';
    const url = `${chainByID(daochain).tokenlist_api_url}${address}`;
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

const parseBlockScout = async (json, address) => {
  const tokenData = await fetchTokenData();
  const daochain = '0x64';
  let erc721s = json.result
    .filter((token) => token.type === 'ERC-721')
    .map(async (b) => {
      const promises = [];
      const nftService = NFTService({
        tokenAddress: b.contractAddress,
        chainID: daochain,
      });
      for (let i = 0; i < b.balance; i++) {
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

  erc721s.map(async (nft, idx) => {
    const promises2 = [];
    const nftService = NFTService({
      tokenAddress: nft.contractAddress,
      chainID: daochain,
    });
    nft.tokenIds.map((tid) => {
      const uri = nftService('tokenURI')({
        tokenId: tid,
      });
      console.log('add uri for', tid);
      promises2.push(uri);
    });
    console.log(promises2);
    nft.tokenURIs = await Promise.all(promises2);
    return nft;
  });
  erc721s = await Promise.all(erc721s);

  const erc20s = json.result
    .filter((token) => token.type === 'ERC-20')
    .map((t) => {
      t.usd = tokenData[t.contractAddress.toLowerCase()]?.price || 0;
      t.totalUSD = parseFloat(+t.balance / 10 ** +t.decimals) * +t.usd;

      return t;
    });
  console.log('erc20serc20serc20s', erc20s);
  console.log('erc721serc721serc721s', erc721s);
  return [...erc20s, ...erc721s];
};

export const getBlockScoutTokenData = async (address) => {
  const json = await fetchBlockScoutAPIData(address);
  const tokenData = parseBlockScout(json, address);
  return tokenData;
};
