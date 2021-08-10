import { ethers } from 'ethers';
import { supportedChains } from './chain';
import { isSameAddress } from './general';
import { MINION_TYPES } from './proposalUtils';
import { TX } from '../data/contractTX';
import { FORM } from '../data/forms';

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

const tokenFormsString = {
  erc20: 'MINION_SEND_ERC20_TOKEN',
  erc721: 'MINION_SEND_ERC721_TOKEN',
  network: 'MINION_SEND_NETWORK_TOKEN',
  sellNifty: 'MINION_SELL_NIFTY',
};

export const getMinionActionFormLego = (tokenType, vaultMinionType) => {
  const formLego = FORM[`${tokenFormsString[tokenType]}`];
  let { tx, minionType } = formLego;

  if (vaultMinionType === 'nifty minion') {
    minionType = MINION_TYPES.NIFTY;
    tx = TX[`${tokenFormsString[tokenType]}_NIFTY`];
  }

  if (vaultMinionType === 'Neapolitan minion') {
    // minionType = MINION_TYPES.NEAPOLITAN;
    // tx = TX[`${tokenFormsString[tokenType]}_NEAPOLITAN`];
  }

  return {
    ...formLego,
    tx,
    minionType,
  };
};

export const vaultFilterOptions = [
  {
    name: 'All Vaults',
    value: 'all',
  },
  {
    name: 'Treasury',
    value: 'treasury',
  },
  {
    name: 'Minion',
    value: 'minion',
  },
];

export const getVaultListData = (minion, daochain, daoid) => {
  if (!minion?.minionType) return 'minon';
  switch (minion.minionType) {
    case MINION_TYPES.SUPERFLUID:
      return {
        badgeColor: 'green',
        badgeTextColor: 'white',
        badgeName: 'SF',
        badgeVariant: 'solid',
        url: `/dao/${daochain}/${daoid}/settings/superfluid-minion/${minion.minionAddress}`,
      };
    case MINION_TYPES.UBER:
      return {
        badgeColor: 'purple',
        badgeTextColor: 'white',
        badgeName: 'UHS',
        badgeVariant: 'solid',
        url: `/dao/${daochain}/${daoid}/allies`,
      };
    case MINION_TYPES.NIFTY:
      return {
        badgeColor: 'orange',
        badgeTextColor: 'white',
        badgeName: 'NIFTY',
        badgeVariant: 'solid',
        url: `/dao/${daochain}/${daoid}/vaults/minion/${minion.minionAddress}`,
      };
    case MINION_TYPES.NEAPOLITAN:
      return {
        badgeColor: 'pink',
        badgeTextColor: '#632b16',
        badgeName: 'NEAPOLITAN',
        badgeVariant: 'outline',
        url: `/dao/${daochain}/${daoid}/vaults/minion/${minion.minionAddress}`,
      };
    default:
      return {
        badgeColor: 'white',
        badgeTextColor: 'black',
        badgeName: 'Vanilla',
        badgeVariant: 'solid',
        url: `/dao/${daochain}/${daoid}/vaults/minion/${minion.minionAddress}`,
      };
  }
};
