import { anyToBN } from '@netgum/utils';

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};

export const valToDecimalString = (value, tokenAddress, tokens) => {

  const tdata = tokens.find((token) => token.value === tokenAddress);
  console.log(tdata.decimals, value);
  if(value>1){

  const decimals = anyToBN(tdata.decimals);
  const exp = anyToBN(10).pow(decimals);
  // keep big number a string
  console.log('decimalstring', anyToBN(value).mul(exp));
  
  return anyToBN(value).mul(exp);
  } else {
  console.log('decimalstring lt 1', value * 10 ** tdata.decimals);

    return value * 10 ** tdata.decimals
  }

};
