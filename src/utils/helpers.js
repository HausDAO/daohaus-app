import { anyToBN } from '@netgum/utils';
import { formatDistanceToNow, format } from 'date-fns';

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};

export const IsJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const proposalDetails = (details) => {
  return details && IsJsonString(details) ? JSON.parse(details) : null;
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
  return format(new Date(createdAt * 1000), 'MMM dd, yyyy');
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
  return { username: address };
};

export const validDaoParams = (location) => {
  const pathname = location.pathname.split('/');
  const daoParam = pathname[2];
  const regex = RegExp('0x[0-9a-f]{10,40}');
  return pathname[1] === 'dao' && regex.test(daoParam) ? daoParam : false;
};

export const formatPeriods = (period, duration) => {
  if (period && duration) {
    let s = period * duration;
    const d = Math.floor(s / (3600 * 24));
    s -= d * 3600 * 24;
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    s -= m * 60;
    const tmp = [];
    d && tmp.push(d + 'd');
    (d || h) && h && tmp.push(h + 'h');
    (d || h || m) && m && tmp.push(m + 'm');
    s && tmp.push(s + 's');

    return tmp.join(' ');
  }
  return 0;
};

export const stripHttpProtocol = (string) => {
  // regex? var tarea_regex = /(http|https)/;
  let newString = '';
  if (string.toLowerCase().indexOf('http://') === 0) {
    newString = string.replace('http://', '');
  } else if (string.toLowerCase().indexOf('https://') === 0) {
    newString = string.replace('https://', '');
  }

  return newString === '' ? string : newString;
};

export const numberWithCommas = (num) => {
  // drop zero after decimal
  const noZeroDec = parseInt(num.split('.')[1]) === 0 ? num.split('.')[0] : num;

  return noZeroDec.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

export const formatPeriodDuration = (seconds) => {
  // const hours = moment.duration(+seconds, 'seconds').asHours();
  // if (hours > 1) {
  //   return `${hours} hour${hours > 1 ? 's' : ''}`;
  // } else {
  //   const minutes = moment.duration(+seconds, 'seconds').asMinutes();
  //   return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  // }
  return 0;
};

export const formatPeriodLength = (periods, duration) => {
  // const periodSeconds = +periods * duration;
  // const days = moment.duration(periodSeconds, 'seconds').asDays();
  // return `${days} day${days > 1 ? 's' : ''}`;
  return 0;
};

export const formatDepositWei = (amount) => {
  // return utils.fromWei(amount.toString(), 'ether');
  return 0;
};

export const periodsForForm = (daoData) => {
  // const votingPeriod = moment
  //   .duration(+daoData.votingPeriod * +daoData.periodDuration, 'seconds')
  //   .asDays();

  // const gracePeriod = moment
  //   .duration(+daoData.gracePeriod * +daoData.periodDuration, 'seconds')
  //   .asDays();

  // return {
  //   votingPeriod,
  //   gracePeriod,
  // };
  return {
    votingPeriod: 0,
    gracePeriod: 0,
  };
};

export const periodsFromForm = (periods, periodDuration) => {
  // const votingSeconds = moment
  //   .duration(+periods['formattedPeriods.votingPeriod'], 'days')
  //   .asSeconds();
  // const votingPeriod = +votingSeconds / +periodDuration;

  // const graceSeconds = moment
  //   .duration(+periods['formattedPeriods.gracePeriod'], 'days')
  //   .asSeconds();
  // const gracePeriod = +graceSeconds / +periodDuration;

  return {
    votingPeriod: 0,
    gracePeriod: 0,
  };
};

export const depositsForForm = (daoData) => {
  return {
    proposalDeposit: formatDepositWei(daoData.proposalDeposit),
    processingReward: formatDepositWei(daoData.processingReward),
  };
};

export const depositsFromForm = (deposits) => {
  // const propDeposit = isNaN(+deposits['formattedDeposits.proposalDeposit'])
  //   ? '0'
  //   : +deposits['formattedDeposits.proposalDeposit'];

  // const procReward = isNaN(+deposits['formattedDeposits.processingReward'])
  //   ? '0'
  //   : +deposits['formattedDeposits.processingReward'];

  // return {
  //   proposalDeposit: web3.utils.toWei(propDeposit.toString(), 'ether'),
  //   processingReward: web3.utils.toWei(procReward.toString(), 'ether'),
  // };
  return {
    proposalDeposit: 0,
    processingReward: 0,
  };
};
