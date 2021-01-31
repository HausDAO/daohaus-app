import { TokenService } from '../services/tokenService';
import { MolochService } from '../services/molochService';
import { omit } from './general';

const geckoURL = 'https://api.coingecko.com/api/v3/simple/token_price';
const uniSwapDataURL =
  'https://raw.githubusercontent.com/Uniswap/default-token-list/master/src/tokens/mainnet.json';
const babe = '0x000000000000000000000000000000000000baBe';
const tokenAPI =
  'https://daohaus-metadata.s3.amazonaws.com/daoTokenPrices.json';

const fetchUniswapData = async () => {
  try {
    const response = await fetch(uniSwapDataURL);
    return response.json();
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchTokenData = async () => {
  try {
    const response = await fetch(tokenAPI);
    return response.json();
  } catch (error) {
    throw new Error(error);
  }
};

export const getUsd = async (tokenAddress) => {
  const url = `${geckoURL}/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const calcTotalUSD = (decimals, tokenBalance, usdVal) => {
  return (+tokenBalance / 10 ** decimals) * +usdVal;
};

export const initTokens = async (graphTokenData) => {
  const tokenCache = JSON.parse(window.sessionStorage.getItem('AllTokens'));

  if (!tokenCache) {
    return initTokenData(graphTokenData);
  } else {
    let cachedTokens = [];
    let newTokens = [];

    for (const tokenObj of graphTokenData) {
      const address = tokenObj.token.tokenAddress;
      if (tokenCache[address]) {
        cachedTokens = [...cachedTokens, tokenCache[address]];
      } else {
        newTokens = [...newTokens, tokenObj];
      }
    }

    if (newTokens.length) {
      const newTokenData = await initTokenData(newTokens);
      return [...cachedTokens, ...newTokenData];
    } else {
      return cachedTokens;
    }
  }
};

export const initTokenData = async (graphTokenData) => {
  const tokenData = await fetchTokenData();
  const uniswapData = await fetchUniswapData();
  const uniswapDataMap = uniswapData.reduce((map, token) => {
    map[token.symbol] = token.logoURI;
    return map;
  }, {});

  return graphTokenData.map((tokenObj) => {
    ensureCacheExists();
    const { token, tokenBalance } = tokenObj;

    const usdVal = tokenData[token.tokenAddress]?.price || 0;
    const symbol = tokenData[token.tokenAddress]?.symbol || null;
    const logoUri = uniswapDataMap[symbol] || null;
    const tokenDataObj = {
      ...omit('token', tokenObj),
      ...token,
      symbol,
      usd: usdVal,
      totalUSD: calcTotalUSD(token.decimals, tokenBalance, usdVal),
      logoUri,
    };
    cacheToken(tokenDataObj, token.tokenAddress);
    return tokenDataObj;
  });
};

export const tallyUSDs = (tokenObj) => {
  let totalUSD = 0;
  for (const token in tokenObj) {
    totalUSD = totalUSD + tokenObj[token].totalUSD;
  }
  return Math.round((totalUSD + Number.EPSILON) * 100) / 100;
};

export const addContractVals = (tokens, chainID) => {
  return Promise.all(
    tokens.map(async (token) => {
      const tokenBalance = await TokenService({
        chainID,
        tokenAddress: token.tokenAddress,
        is32: false,
      })('balanceOf')(token.moloch.id);
      const babeBalance = await MolochService({
        tokenAddress: token.tokenAddress,
        chainID,
        daoAddress: token.moloch.id,
        version: +token.moloch.version,
      })('getUserTokenBalance')({
        userAddress: babe,
        tokenAddress: token.tokenAddress,
      });
      return {
        ...token,
        contractBalances: {
          token: +tokenBalance,
          babe: +babeBalance,
        },
      };
    }),
  );
};

export const getTotalBankValue = (tokenBalances, prices) => {
  return tokenBalances.reduce((sum, balance) => {
    if (balance.guildBank) {
      const price = prices[balance.token.tokenAddress.toLowerCase()]
        ? prices[balance.token.tokenAddress.toLowerCase()].price
        : 0;
      const value =
        (+balance.tokenBalance / 10 ** balance.token.decimals) * price;

      return (sum += value);
    } else {
      return sum;
    }
  }, 0);
};

/// /////Caching Utils//////////////

export const cacheToken = (newToken, tokenAddress) => {
  if (!newToken) return;

  const tokenCache = JSON.parse(window.sessionStorage.getItem('AllTokens'));
  const newCache = JSON.stringify({
    ...tokenCache,
    [tokenAddress]: newToken,
  });
  window.sessionStorage.setItem('AllTokens', newCache);
};

export const ensureCacheExists = () => {
  const cacheExists = window.sessionStorage.getItem('AllTokens');
  if (cacheExists) {
    return true;
  } else {
    window.sessionStorage.setItem('AllTokens', JSON.stringify({}));
  }
};
