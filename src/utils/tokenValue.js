import { balanceOf } from "../services/tokenService";
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
      const tokenBalance = await balanceOf({
        chainID,
        tokenAddress: token.tokenAddress,
        queryAddress: token.moloch.id,
        is32: false,
      });
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

// const fetchForUSD = async (graphTokenData, uniswapDataMap, { isMainnet }) => {
//   const addressList = graphTokenData
//     .map(({ token }) => (isMainnet ? token.tokenAddress : token.altAddress))
//     .toString();
//   try {
//     const tokenPrices = await getUsd(addressList);
//     return mergeDataWithTokenPrice(
//       graphTokenData,
//       tokenPrices,
//       uniswapDataMap,
//       isMainnet
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };

// const convertToMainNetVals = async (graphTokenData, symbolAddressMap) => {
//   return graphTokenData.map((tokenType) => {
//     const { token } = tokenType;
//     const symbol = token.symbol === "WXDAI" ? "DAI" : token.symbol;
//     const foundAddress = symbolAddressMap[symbol]?.address;
//     if (foundAddress) {
//       return {
//         ...tokenType,
//         token: {
//           ...token,
//           altAddress: foundAddress,
//           totalUSD: calcTotalUSD(),
//         },
//       };
//     } else {
//       return tokenType;
//     }
//   });
// };

// const mergeDataWithTokenPrice = (
//   graphTokenData,
//   tokenPrices,
//   uniswapDataMap,
//   isMainnet
// ) => {
//   return graphTokenData.map((tokenType) => {
//     const { token, tokenBalance } = tokenType;
//     let usdVal;
//     if (isMainnet) {
//       usdVal = tokenPrices[token.tokenAddress]?.usd || 0;
//     } else {
//       usdVal = tokenPrices[token.altAddress]?.usd || 0;
//     }
//     const logoUri = uniswapDataMap[token.symbol]?.logoUri
//       ? uniswapDataMap[token.symbol].logoUri
//       : null;
//     return {
//       ...omit("token", tokenType),
//       ...token,
//       usd: usdVal,
//       totalUSD: calcTotalUSD(token.decimals, tokenBalance, usdVal),
//       logoUri,
//     };
//   });
// };

// export const addUSD = async (chainID, graphTokenData) => {
//   try {
//     const uniswapData = await fetchUniswapData();
//     const tokenData = await fetchTokenData();
//     const uniswapDataMap = uniswapData.reduce((map, token) => {
//       map[token.symbol] = {
//         address: token.address.toLowerCase(),
//         logoUri: token.logoURI,
//       };
//       return map;
//     }, {});

//     if (chainID === "0x1") {
//       const stateReadyVals = await fetchForUSD(graphTokenData, uniswapDataMap, {
//         isMainnet: true,
//       });
//       return stateReadyVals;
//     } else if (chainID === "0x4" || chainID === "0x2a" || chainID === "0x64") {
//       const mainNetVals = await convertToMainNetVals(
//         graphTokenData,
//         uniswapDataMap
//       );
//       const stateReadyVals = await fetchForUSD(mainNetVals, uniswapDataMap, {
//         isMainnet: false,
//       });
//       return stateReadyVals;
//     } else {
//       console.error(`ChainID: ${chainID} is not a valid ID`);
//       return;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
