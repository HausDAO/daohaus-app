import { ethers } from 'ethers';

import { omit } from './general';
import { validate } from './validation';
import { createContract } from './contract';
import { LOCAL_ABI } from './abi';
import { chainByID } from './chain';

const babe = '0x000000000000000000000000000000000000baBe';
const tokenAPI = 'https://data.daohaus.club/dao-tokens';

export const fetchTokenData = async () => {
  try {
    const response = await fetch(tokenAPI);
    return response.json();
  } catch (error) {
    throw new Error(error);
  }
};

export const calcTotalUSD = (decimals, tokenBalance, usdVal) => {
  return (+tokenBalance / 10 ** decimals) * +usdVal;
};

export const initTokenData = async (
  daochain,
  graphTokenData,
  tokenPriceSetter,
) => {
  const tokenData = await fetchTokenData();

  if (tokenData && tokenPriceSetter) {
    tokenPriceSetter(tokenData);
  }

  const network = chainByID(daochain).networkAlt || chainByID(daochain).network;

  return graphTokenData
    .map(tokenObj => {
      const { token, tokenBalance } = tokenObj;
      const tokenMeta =
        tokenData[token.tokenAddress]?.network === network &&
        tokenData[token.tokenAddress];

      let usdVal = tokenMeta?.price || 0;
      // TODO: overriding due to one off wxdai issue
      if (token.tokenAddress === '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d') {
        usdVal = tokenData[token.tokenAddress].price;
      }
      const symbol = tokenMeta?.symbol || token.symbol;
      const logoUri = tokenMeta?.logoURI || null;
      const tokenName = tokenMeta?.name || null;
      const tokenDataObj = {
        ...omit('token', tokenObj),
        ...token,
        symbol,
        usd: usdVal,
        totalUSD: calcTotalUSD(token.decimals, tokenBalance, usdVal),
        logoUri,
        tokenName,
      };

      return tokenDataObj;
    })
    .filter(t => t.symbol !== null);
};

export const tallyUSDs = tokenObj => {
  let totalUSD = 0;

  for (const token in tokenObj) {
    totalUSD += tokenObj[token]?.totalUSD || 0;
  }

  return Math.round((totalUSD + Number.EPSILON) * 100) / 100;
};

export const addContractVals = (tokens, chainID) => {
  return Promise.all(
    tokens.map(async token => {
      try {
        const tokenContract = createContract({
          address: token.tokenAddress,
          abi: LOCAL_ABI.ERC_20,
          chainID,
        });
        const tokenBalance = await tokenContract.methods
          .balanceOf(token?.moloch?.id)
          .call();

        const molochContract = createContract({
          address: token?.moloch?.id,
          abi: LOCAL_ABI.MOLOCH_V2,
          chainID,
        });
        const babeBalance = await molochContract.methods
          .getUserTokenBalance(babe, token.tokenAddress)
          .call();

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

export const getReadableBalance = (tokenData, fixed) => {
  if (tokenData?.balance && tokenData.decimals) {
    const { balance, decimals } = tokenData;
    if (fixed) {
      return (Number(balance) / 10 ** Number(decimals))?.toFixed(fixed);
    }
    return Number(balance) / 10 ** Number(decimals);
  }
};
export const getContractBalance = (readableBalance, decimals) => {
  if (!validate.number(readableBalance) || !validate.number(decimals))
    return null;
  const floatPoint = readableBalance.split('.')[1]?.length;
  const exponent = ethers.BigNumber.from(10).pow(
    floatPoint ? decimals - floatPoint : decimals,
  );

  return ethers.utils
    .parseUnits(readableBalance, floatPoint || 0)
    .mul(exponent)
    .toString();
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
    return parseFloat(Number(tokenBalance) / 10 ** Number(decimals)).toFixed(4);
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

export const fetchBalance = ({ address, chainID, tokenAddress }) => {
  try {
    const tokenContract = createContract({
      address: tokenAddress,
      abi: LOCAL_ABI.ERC_20,
      chainID,
    });
    const max = tokenContract.methods.balanceOf(address).call();
    return max;
  } catch (error) {
    console.log(error);
  }
};

//  for use with daoMemberContext {daoMember, delegate}
export const getAllowance = (daoMember, delegate) => {
  if (daoMember?.hasWallet && daoMember?.allowance) {
    return +daoMember.allowance;
  }
  if (delegate?.hasWallet && delegate?.allowance) {
    return +delegate.allowance;
  }
  return null;
};

export const fetchSpecificTokenData = async (
  tokenAddress,
  searchParams,
  chainID,
) => {
  let data = {};
  const tokenContract = createContract({
    address: tokenAddress,
    abi: LOCAL_ABI.ERC_20,
    chainID,
  });
  if (!tokenContract || !validate.address(tokenAddress) || !searchParams)
    return;
  try {
    if (searchParams.balance) {
      const balance = await tokenContract.methods
        .balanceOf(searchParams.balance)
        .call();
      data = { ...data, balance };
    }
    if (searchParams.allowance) {
      const allowance = await tokenContract.methods
        .allowance(searchParams.allowance)
        .call();
      data = { ...data, allowance };
    }
    if (searchParams.decimals) {
      const decimals = await tokenContract.methods.decimals().call();
      data = { ...data, decimals };
    }
    if (searchParams.name) {
      const name = await tokenContract.methods.name().call();
      data = { ...data, name };
    }
    if (searchParams.symbol) {
      const symbol = await tokenContract.methods.symbol().call();
      data = { ...data, symbol };
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};
