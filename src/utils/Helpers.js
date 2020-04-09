import { anyToBN } from '@netgum/utils';

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};

export const valToDecimalString = (value, tokenAddress, tokens) => {

  const tdata = tokens.find((token) => token.value === tokenAddress);
  // TODO: this does not work with decimals
  if(value>1000000){
  const decimals = anyToBN(tdata.decimals);
  const exp = anyToBN(10).pow(decimals);
  console.log('decimalstring', anyToBN(value).mul(exp));
  
  return anyToBN(value).mul(exp);
  } else {
    console.log('decimalstring lt 1', (value * 10 ** tdata.decimals).toString());
    return (value * 10 ** tdata.decimals).toString()
  }

};
