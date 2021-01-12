const geckoURL = "https://api.coingecko.com/api/v3/simple/token_price";
const uniSwapDataURL =
  "https://raw.githubusercontent.com/Uniswap/default-token-list/master/src/tokens/mainnet.json";

const fetchUniswapData = async () => {
  try {
    const response = await fetch(uniSwapDataURL);
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
const mergeDataWithTokenPrice = (
  graphTokenData,
  tokenPrices,
  uniswapDataMap
) => {
  return graphTokenData.flat().reduce((obj, tokenType) => {
    const { token, id, guildBank, moloch, tokenBalance } = tokenType;
    const usdVal = tokenPrices[token.tokenAddress]
      ? tokenPrices[token.tokenAddress].usd
      : 0;
    const logoUri = uniswapDataMap[token.symbol]?.logoUri
      ? uniswapDataMap[token.symbol].logoUri
      : null;
    return {
      ...obj,
      [token.tokenAddress]: {
        usd: usdVal,
        ...token,
        id,
        guildBank,
        moloch,
        tokenBalance,
        totalUSD: calcTotalUSD(token.decimals, tokenBalance, usdVal),
        logoUri,
      },
    };
  }, {});
};

const fetchForUSD = async (graphTokenData, uniswapDataMap) => {
  const addressList = graphTokenData
    .map(({ token }) => token.tokenAddress)
    .toString();
  try {
    const tokenPrices = await getUsd(addressList);
    return mergeDataWithTokenPrice(graphTokenData, tokenPrices, uniswapDataMap);
  } catch (error) {
    console.error(error);
  }
};

const convertToMainNetVals = async (graphTokenData, symbolAddressMap) => {
  return graphTokenData.map((tokenType) => {
    const { token } = tokenType;
    const symbol = token.symbol === "WXDAI" ? "DAI" : token.symbol;
    const foundAddress = symbolAddressMap[symbol]?.address;
    if (foundAddress) {
      return {
        ...tokenType,
        token: {
          ...token,
          tokenAddress: foundAddress,
        },
      };
    } else {
      return tokenType;
    }
  });
};

export const addUSD = async (chainID, graphTokenData) => {
  try {
    const uniswapData = await fetchUniswapData();
    const uniswapDataMap = uniswapData.reduce((map, token) => {
      map[token.symbol] = {
        address: token.address.toLowerCase(),
        logoUri: token.logoURI,
      };
      return map;
    }, {});

    if (chainID === "0x1") {
      const stateReadyVals = await fetchForUSD(graphTokenData, uniswapDataMap);
      return stateReadyVals;
    } else if (chainID === "0x4" || chainID === "0x2a" || chainID === "0x64") {
      const mainNetVals = await convertToMainNetVals(
        graphTokenData,
        uniswapDataMap
      );
      const stateReadyVals = await fetchForUSD(mainNetVals, uniswapDataMap);
      return stateReadyVals;
    } else {
      console.error(`ChainID: ${chainID} is not a valid ID`);
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

export const tallyUSDs = (tokenObj) => {
  let totalUSD = 0;
  for (let token in tokenObj) {
    totalUSD = totalUSD + tokenObj[token].totalUSD;
  }
  return Math.round((totalUSD + Number.EPSILON) * 100) / 100;
};
