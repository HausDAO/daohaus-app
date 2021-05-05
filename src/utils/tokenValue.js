import { ethers } from 'ethers';
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

export const getUsd = async tokenAddress => {
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

export const initTokenData = async graphTokenData => {
  const tokenData = await fetchTokenData();
  const uniswapData = await fetchUniswapData();
  const uniswapDataMap = uniswapData.reduce((map, token) => {
    map[token.symbol] = token.logoURI;
    return map;
  }, {});

  return graphTokenData
    .map(tokenObj => {
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

      return tokenDataObj;
    })
    .filter(t => t.symbol !== null);
};

export const tallyUSDs = tokenObj => {
  let totalUSD = 0;

  for (const token in tokenObj) {
    // if (!tokenObj[token]?.totalUSD) {
    //   console.error('TokenError', tokenObj);
    // }
    totalUSD += tokenObj[token].totalUSD;
  }
  return Math.round((totalUSD + Number.EPSILON) * 100) / 100;
};

export const addContractVals = (tokens, chainID) => {
  return Promise.all(
    tokens.map(async token => {
      try {
        const tokenBalance = await TokenService({
          chainID,
          tokenAddress: token.tokenAddress,
          is32: false,
        })('balanceOf')(token?.moloch?.id);
        const babeBalance = await MolochService({
          tokenAddress: token.tokenAddress,
          chainID,
          daoAddress: token?.moloch?.id,
          version: +token?.moloch?.version,
        })('getUserTokenBalance')({
          userAddress: babe,
          tokenAddress: token.tokenAddress,
        });
        return {
          ...token,
          contractBalances: {
            token: +tokenBalance || 0,
            babe: +babeBalance || 0,
          },
        };
      } catch (error) {
        console.error(error);
      }
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
    }
    return sum;
  }, 0);
};

export const valToDecimalString = (value, tokenAddress, tokens) => {
  // get correct value of token with decimal places
  // returns a string
  const tdata = tokens.find(token => token.token.tokenAddress === tokenAddress);

  // is the value a float or int? set appropriate decimals buffer
  const decimals = value.split('.')[1]?.length;
  const exp = ethers.BigNumber.from(10).pow(
    decimals ? tdata.token.decimals - decimals : tdata.token.decimals,
  );

  if (decimals) {
    return ethers.utils
      .parseUnits(value, decimals)
      .mul(exp)
      .toString();
  }
  return ethers.utils
    .parseUnits(value, 0)
    .mul(exp)
    .toString();
};

export const displayBalance = (tokenBalance, decimals) => {
  if (tokenBalance && decimals) {
    return parseFloat(+tokenBalance / 10 ** +decimals).toFixed(4);
  }
};

export const addZeros = (roundedVal, decimals) => {
  const scaleFactor = 10;
  const perc = 10 ** scaleFactor;

  const exp = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(decimals));

  if (roundedVal >= perc) {
    return ethers.BigNumber.from(roundedVal)
      .mul(exp)
      .toString();
  }
  roundedVal *= perc;
  return ethers.BigNumber.from(roundedVal)
    .mul(exp)
    .div(ethers.BigNumber.from(perc))
    .toString();
};
