import { anyToBN } from '@netgum/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { utils } from 'web3';

import { supportedChains } from './chains';

export const truncateAddr = (addr) => {
  return addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : null;
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
  details = details && details.replace(/(\r\n|\n|\r)/gm, ' ');
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
  let daoParam = pathname[2];
  if (daoParam) {
    daoParam = daoParam.toLowerCase();
  }
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

// use date FNS
export const numberWithCommas = (num) => {
  // drop zero after decimal
  const noZeroDec = parseInt(num.split('.')[1]) === 0 ? num.split('.')[0] : num;

  return noZeroDec.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

export const formatPeriodDuration = (seconds) => {
  const hours = +seconds / 60 / 60;
  if (hours > 1) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    const minutes = +seconds / 60;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
};

export const periodsPerDayPreset = (seconds) => {
  const hours = +seconds / 60 / 60;

  const perDay = Math.ceil(24 / hours);

  if (24 / hours < 1) {
    return `Less than ${perDay} per day`;
  } else {
    return `${perDay} per day`;
  }
};

export const formatPeriodLength = (periods, duration) => {
  const periodSeconds = +periods * duration;
  const days = periodSeconds / 60 / 60 / 24;
  return `${days} day${days > 1 ? 's' : ''}`;
};

export const formatDepositWei = (amount) => {
  return utils.fromWei(amount.toString(), 'ether');
};

export const periodsForForm = (daoData) => {
  const votingPeriod =
    (+daoData.votingPeriod * +daoData.periodDuration) / 60 / 60 / 24;

  const gracePeriod =
    (+daoData.gracePeriod * +daoData.periodDuration) / 60 / 60 / 24;

  return {
    votingPeriod,
    gracePeriod,
  };
};

export const periodsFromForm = (periods, periodDuration) => {
  const votingSeconds =
    +periods['formattedPeriods.votingPeriod'] * 60 * 60 * 24;
  const votingPeriod = +votingSeconds / +periodDuration;

  const graceSeconds = +periods['formattedPeriods.gracePeriod'] * 60 * 60 * 24;
  const gracePeriod = +graceSeconds / +periodDuration;

  return {
    votingPeriod,
    gracePeriod,
  };
};

export const depositsForForm = (daoData) => {
  return {
    proposalDeposit: formatDepositWei(daoData.proposalDeposit),
    processingReward: formatDepositWei(daoData.processingReward),
  };
};

export const depositsFromForm = (deposits) => {
  const propDeposit = isNaN(+deposits['formattedDeposits.proposalDeposit'])
    ? '0'
    : +deposits['formattedDeposits.proposalDeposit'];

  const procReward = isNaN(+deposits['formattedDeposits.processingReward'])
    ? '0'
    : +deposits['formattedDeposits.processingReward'];

  return {
    proposalDeposit: utils.toWei(propDeposit.toString(), 'ether'),
    processingReward: utils.toWei(procReward.toString(), 'ether'),
  };
};

export const getRpcUrl = (network) => {
  return network.network_id === 100
    ? 'https://dai.poa.network '
    : `https://${network.network}.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
};

export const themeImagePath = (imageValue) => {
  if (
    !imageValue ||
    imageValue.slice(0, 1) === '/' ||
    imageValue.slice(0, 4) === 'http'
  ) {
    return imageValue;
  }

  if (imageValue.slice(0, 2) === 'Qm') {
    // https://ipfs.infura.io/ipfs
    return `https://gateway.pinata.cloud/ipfs/${imageValue}`;
  }
};

export const pokemolUrl = (dao) => {
  const networkName = supportedChains[+dao.networkId].network;
  const domain =
    networkName === 'mainnet' ? 'pokemol.com' : `${networkName}.pokemol.com`;
  return `https://${domain}/dao/${dao.id}`;
};
