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

// const prices = currentDaoTokens.reduce((priceMap, token) => {
//   priceMap[token.tokenAddress] = token;
//   return priceMap;
// }, {});
