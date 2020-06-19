import { anyToBN } from '@netgum/utils';

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};

export const valToDecimalString = (value, tokenAddress, tokens) => {
  // get correct value of token with decimal places
  // returns a string

  const tdata = tokens.find((token) => token.value === tokenAddress);
  // TODO: this does not work with decimals
  if (value >= 1000) {
    const decimals = anyToBN(tdata.decimals);
    const exp = anyToBN(10).pow(decimals);
    // console.log(
    //   'decimalstring',
    //   anyToBN(value)
    //     .mul(exp)
    //     .toString(),
    // );

    return anyToBN(value)
      .mul(exp)
      .toString();
  } else {
    // console.log(
    //   'decimalstring < 1000',
    //   (value * 10 ** tdata.decimals).toString(),
    // );
    return (value * 10 ** tdata.decimals).toString();
  }
};

export const hydrateBoosts = (boosts) => {
  return {
    proposalComments: boosts.some((boost) => boost.boostId.includes(7)),
    customTheme: boosts.some((boost) => boost.boostId.includes(1)),
  };
};
