import { anyToBN } from '@netgum/utils';
import { formatDistanceToNow } from 'date-fns';
// import moment from 'moment';

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};

export const valToDecimalString = (value, tokenAddress, tokens) => {
  // get correct value of token with decimal places
  // returns a string

  const tdata = tokens.find((token) => token.value === tokenAddress);
  if (value >= 1000) {
    const decimals = anyToBN(tdata.decimals);
    const exp = anyToBN(10).pow(decimals);

    return anyToBN(value)
      .mul(exp)
      .toString();
  } else {
    return (value * 10 ** tdata.decimals).toString();
  }
};

export const formatCreatedAt = (createdAt) => {
  // return moment.unix(createdAt).format('MMM Do');
};

export const timeToNow = (time) => {
  return formatDistanceToNow(new Date(time * 1000), { addSuffix: true });
};

export const memberProfile = (members, address) => {
  const member = members.filter((m) => {
    return m.memberAddress === address.toLowerCase();
  });
  if (member.length > 0 && Object.keys(member[0].profile).length > 0) {
    return member[0];
  }
  return { profile: { username: address } };
};
