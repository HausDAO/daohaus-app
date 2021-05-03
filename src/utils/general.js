import { formatDistanceToNow } from 'date-fns';
import { utils } from 'ethers';
import Web3 from 'web3';

export const SECONDS = {
  PER_MINUTE: 60,
  PER_HOUR: 3600,
  PER_DAY: 86400,
  PER_WEEK: 604800,
};

export const calcSeconds = (val, unit) => {
  if (!unit || !val) return;

  unit = unit.toLowerCase();
  val = parseInt(val);
  if (unit === 'seconds' || unit === 'second') {
    return val;
  }
  if (unit === 'minutes' || unit === 'minute') {
    return val * SECONDS.PER_MINUTE;
  }
  if (unit === 'hours' || unit === 'hour') {
    return val * SECONDS.PER_HOUR;
  }
  if (unit === 'days' || unit === 'day') {
    return val * SECONDS.PER_DAY;
  }
  if (unit === 'weeks' || unit === 'week') {
    return val * SECONDS.PER_WEEK;
  }
  console.error('Did not receive the corrent arguments to calculate time');
  return false;
};

export const pipe = (...fns) => x => fns.reduce((prev, func) => func(prev), x);

export const parseIfJSON = data => {
  try {
    const JSONdata = JSON.parse(data);
    return JSONdata;
  } catch {
    return data;
  }
};

export const IsJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const createHash = () => {
  return Math.random()
    .toString(36)
    .slice(2);
};

export const detailsToJSON = values => {
  const details = {};
  details.title = values.title;
  // random string
  details.hash = values.hash;
  if (values.description) {
    details.description = values.description;
  }
  if (values.link) {
    details.link = values.link;
  }
  if (values.forumId) {
    details.forumId = values.forumId;
  }
  if (values.uberHaus) {
    details.uberHaus = values.uberHaus;
  }
  if (values.uberType) {
    details.uberType = values.uberType;
  }
  if (values.ratePerSec) {
    details.recipient = values.recipient;
    details.token = values.token;
    details.tokenRate = values.tokenRate;
    details.ratePerSec = values.ratePerSec;
    details.minDeposit = values.minDeposit;
  }
  if (values.cco) {
    details.cco = values.cco;
  }
  if (values.isTransmutation) {
    details.isTransmutation = true;
  }
  return JSON.stringify(details);
};

// omits key/pairs from objects
export const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

export const numberWithCommas = num => {
  if (num === 0) return 0;
  if (!num) return;
  const localNum = typeof num !== 'string' ? num.toString() : num;
  // drop zero after decimal
  const noZeroDec =
    parseInt(localNum.split('.')[1]) === 0
      ? localNum.split('.')[0]
      : parseFloat(localNum);
  return noZeroDec ? utils.commify(noZeroDec) : num;
};

export const truncateAddr = addr => {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : null;
};
export const timeToNow = time => {
  return formatDistanceToNow(new Date(time * 1000), {
    addSuffix: true,
  });
};

// export const formatCreatedAt = (createdAt) => {
//   return format(new Date(createdAt * 1000), 'MMM dd, yyyy');
// };

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
    d && tmp.push(`${d}d`);
    (d || h) && h && tmp.push(`${h}h`);
    (d || h || m) && m && tmp.push(`${m}m`);
    s && tmp.push(`${s}s`);

    return tmp.join(' ');
  }
  return 0;
};

export const stripHttpProtocol = string => {
  // regex? var tarea_regex = /(http|https)/;
  let newString = '';
  if (string.toLowerCase().indexOf('http://') === 0) {
    newString = string.replace('http://', '');
  } else if (string.toLowerCase().indexOf('https://') === 0) {
    newString = string.replace('https://', '');
  }

  return newString === '' ? string : newString;
};

export const capitalize = string => {
  if (string) {
    return string[0].toUpperCase() + string.slice(1);
  }
};

export const daoConnectedAndSameChain = (
  address,
  injectedChainID,
  daochain,
) => {
  return address && daochain && injectedChainID === daochain;
};

export const isEthAddress = string =>
  typeof string === 'string' && /^0x[a-fA-F0-9]{40}$/.test(string)
    ? string
    : false;

export const isDelegating = member => {
  if (member?.memberAddress && member?.delegateKey) {
    return member?.memberAddress !== member?.delegateKey;
  }
};
export const checkIfUserIsDelegate = (address, daoMembers) => {
  if (address && daoMembers) {
    const lowCaseAddress = address?.toLowerCase();
    return daoMembers.filter(member => member.delegateKey === lowCaseAddress);
  }
};

export const getQueryStringParams = query => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          const [key, value] = param.split('=');
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, ' '))
            : '';
          return params;
        }, {})
    : {};
};

export const groupByKey = (array, key) => {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
};

export const deriveValFromWei = amt => {
  if (amt === 0) return 0;
  if (!amt) return;
  return Web3.utils.fromWei(amt.toString());
};

export const handleDecimals = (balance, decimals, fallback = '--') => {
  if (!balance || !decimals) return fallback;
  return Number(balance) / 10 ** Number(decimals);
};
