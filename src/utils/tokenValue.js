import { TokenService } from "../services/tokenService";
import { MolochService } from "../services/molochService";
import { omit } from "./general";

const geckoURL = "https://api.coingecko.com/api/v3/simple/token_price";
const uniSwapDataURL =
  "https://raw.githubusercontent.com/Uniswap/default-token-list/master/src/tokens/mainnet.json";
const babe = "0x000000000000000000000000000000000000baBe";
const tokenAPI =
  "https://daohaus-metadata.s3.amazonaws.com/daoTokenPrices.json";

const fetchUniswapData = async () => {
  try {
    const response = await fetch(uniSwapDataURL);
    return response.json();
  } catch (error) {
    throw new Error(error);
  }
};

const fetchTokenData = async () => {
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

export const initTokenData = async (chainID, graphTokenData) => {
  const tokenData = await fetchTokenData();
  const uniswapData = await fetchUniswapData();
  const uniswapDataMap = uniswapData.reduce((map, token) => {
    map[token.symbol] = token.logoURI;
    return map;
  }, {});

  return graphTokenData.map((tokenObj) => {
    const { token, tokenBalance } = tokenObj;
    const usdVal = tokenData[token.tokenAddress]?.price || 0;
    const symbol = tokenData[token.tokenAddress]?.symbol || null;
    const logoUri = uniswapDataMap[symbol] || null;
    return {
      ...omit("token", tokenObj),
      ...token,
      symbol,
      usd: usdVal,
      totalUSD: calcTotalUSD(token.decimals, tokenBalance, usdVal),
      logoUri,
    };
  });
};

export const tallyUSDs = (tokenObj) => {
  let totalUSD = 0;
  for (let token in tokenObj) {
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
      })("balanceOf")(token.moloch.id);
      const babeBalance = await MolochService({
        tokenAddress: token.tokenAddress,
        chainID,
        daoAddress: token.moloch.id,
        version: +token.moloch.version,
      })("getUserTokenBalance")({
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
    })
  );
};
