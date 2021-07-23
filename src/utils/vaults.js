import { ethers } from 'ethers';
import { supportedChains } from './chain';
import { isSameAddress } from './general';

export const getReadableBalance = tokenData => {
  if (tokenData?.balance && tokenData.decimals) {
    const { balance, decimals } = tokenData;
    return Number(balance) / 10 ** Number(decimals);
  }
};
export const getContractBalance = (readableBalance, decimals) => {
  const floatPoint = readableBalance.split('.')[1]?.length;
  const exponent = ethers.BigNumber.from(10).pow(
    floatPoint ? decimals - floatPoint : decimals,
  );
  return ethers.utils
    .parseUnits(readableBalance, floatPoint || 0)
    .mul(exponent)
    .toString();
};

export const getVaultERC20s = (daoVaults, vaultAddress) =>
  daoVaults?.find(vault => isSameAddress(vault.address, vaultAddress))?.erc20s;

export const getTokenFromList = (erc20s, tokenAddress) =>
  erc20s?.find(token => isSameAddress(token.contractAddress, tokenAddress));

export const getReadableBalanceFromList = (erc20s, tokenAddress) =>
  getReadableBalance(getTokenFromList(erc20s, tokenAddress));

export const getTokenData = (daoVaults, vaultAddress, tokenAddress) => {
  const tokenData = getTokenFromList(
    getVaultERC20s(daoVaults, vaultAddress),
    tokenAddress,
  );
  return tokenData;
};

const vaultTokenAddressKey = vaultType => {
  switch (vaultType) {
    case 'treasury': {
      return 'tokenAddress';
    }
    default: {
      return 'contractAddress';
    }
  }
};

export const vaultUrlPart = vault => {
  return vault.type === 'treasury' ? `treasury` : `minion/${vault.address}`;
};

export const vaultTokenCount = vaults => {
  const addresses = vaults.flatMap(vault => {
    return vault.erc20s.map(t => t[vaultTokenAddressKey(vault.type)]);
  });

  return new Set([...addresses]).size;
};

export const getCurrentPrices = vaults => {
  return vaults.reduce((priceMap, vault) => {
    vault.erc20s.forEach(token => {
      priceMap[token[vaultTokenAddressKey(vault.type)]] = token;
    });
    return priceMap;
  }, {});
};

export const formatNativeData = (daochain, balance) => {
  return [
    {
      isNative: true,
      totalUSD: 0,
      usd: 0,
      id: daochain,
      logoUri: '',
      tokenAddress: daochain,
      tokenBalance: balance,
      decimals: '18',
      tokenName: supportedChains[daochain].nativeCurrency,
      symbol: supportedChains[daochain].nativeCurrency,
    },
  ];
};
