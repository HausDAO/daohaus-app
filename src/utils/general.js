import { randomBytes } from 'crypto-browserify';
import { format, formatDistanceToNow } from 'date-fns';
import { utils } from 'ethers';
import Web3 from 'web3';
import { validate } from './validation';

export const HASH = {
  EMPTY_FIELD: 'e3bb180f-dda4-46e0-8ba5-7b24e7b00855',
  AWAITING_VALUE: '13345e28-135b-46ed-8047-716324197a6b',
  PROPS_MESSAGE: 'b136aa06-7d7c-42a3-824f-c92ed163b18a',
};

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

export const pipe = fns => x => fns.reduce((prev, fn) => fn(prev), x);

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
  if (values.ratePerSec) {
    details.recipient = values.recipient;
    details.token = values.token;
    details.tokenRate = values.tokenRate;
    details.ratePerSec = values.ratePerSec;
    details.minDeposit = values.minDeposit;
  }
  if (values.isTransmutation) {
    details.isTransmutation = true;
  }
  if (values.minionType) {
    details.minionType = values.minionType;
  }
  if (values.proposalType) {
    details.proposalType = values.proposalType;
  }
  if (values.fundsRequested) {
    details.fundsRequested = values.fundsRequested;
    details.token = values.token;
  }
  return JSON.stringify(details);
};

// omits key/pairs from objects
export const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

export const mapObject = (object, callback) => {
  const newObj = {};
  let index = 0;
  for (const key in object) {
    newObj[key] = callback(object[key], key, index, newObj);
    index += 1;
  }
  return newObj;
};
export const filterObject = (object, callback) => {
  const newObj = {};
  let index = 0;
  for (const key in object) {
    if (callback(object[key], key, index, newObj)) {
      newObj[key] = object[key];
    }
    index += 1;
  }
  return newObj;
};
export const getObjectLength = object =>
  object ? Object.keys(object).length : 0;
export const isObjectEmpty = object => getObjectLength(object) === 0;

export const areAnyFields = (param, obj) => {
  if (!obj || !param) return;
  if (param === 'truthy') {
    return Object.values(obj).some(field => field);
  }
  if (param === 'falsy') {
    return Object.values(obj).some(field => !field);
  }
};

export const minionFromDaoOverview = ({
  searchBy,
  daoOverview,
  searchParam,
  crossChain,
}) => {
  if (!daoOverview || !searchBy || !searchParam) return;
  if (searchBy === 'type')
    return daoOverview.minions?.filter(
      minion =>
        minion.minionType === searchParam &&
        !!minion.crossChainMinion === !!crossChain,
    );
  if (searchBy === 'name')
    return daoOverview.minions.find(minion => minion.details === searchParam);
};

export const numberWithCommas = num => {
  if (num === 0) return 0;
  if (!num) return;
  const localNum = typeof num !== 'string' ? num.toString() : num;
  if (localNum.includes(`e-`)) return localNum;
  // drop zero after decimal
  const noZeroDec =
    parseInt(localNum.split('.')[1]) === 0
      ? localNum.split('.')[0]
      : parseFloat(localNum);

  const localNoZeroDec =
    typeof noZeroDec !== 'string' ? noZeroDec.toString() : noZeroDec;
  if (localNoZeroDec.includes(`e-`)) return localNoZeroDec;

  return noZeroDec ? utils.commify(noZeroDec) : num;
};

export const fromWeiToFixedDecimal = (value, decimals = 2) => {
  const commaIndex = utils.formatEther(value).indexOf('.');
  if (commaIndex === -1) {
    return Number(utils.formatEther(value));
  }
  return Number(utils.formatEther(value).slice(0, commaIndex + decimals + 1));
};

export const truncateAddr = addr => {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : null;
};
export const timeToNow = time => {
  return formatDistanceToNow(new Date(time * 1000), {
    addSuffix: true,
  });
};
export const formatCreatedAt = createdAt => {
  return format(new Date(createdAt * 1000), 'MMM dd, yyyy');
};
export const formatDate = (dateTimeMillis, formatDate = 'MMM dd, yyyy') => {
  return format(new Date(dateTimeMillis * 1000), formatDate);
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
export const capitalizeWords = string => {
  if (!string) return null;
  const words = string.split(' ');
  if (words?.length <= 1) {
    return capitalize(words);
  }
  return words.map(word => capitalize(word)).join(' ');
};

export const charLimit = (str = '', limit = 24) =>
  str.length > limit ? `${str.slice(0, limit)}...` : str;

export const daoConnectedAndSameChain = (
  address,
  injectedChainID,
  daochain,
  foreignChainId,
) => {
  return !foreignChainId
    ? address && daochain && injectedChainID === daochain
    : address &&
        daochain &&
        [daochain, foreignChainId].includes(injectedChainID);
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
    return daoMembers.filter(
      member =>
        member.memberAddress !== lowCaseAddress &&
        member.delegateKey === lowCaseAddress,
    );
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

export const handleBNDecimals = (balance, decimals, fallback = '--') => {
  if (!balance || !decimals) return fallback;
  return utils.formatUnits(balance, decimals).toString();
};

export const handlePossibleNumber = (val, comma = true, roundAmt = 4) => {
  if (val == null) return;
  if (validate.number(val)) {
    const number = Number(val);
    if (comma && roundAmt) {
      return numberWithCommas(number.toFixed(roundAmt));
    }
    if (comma) {
      return numberWithCommas(number);
    }
    if (roundAmt === 0 || roundAmt) {
      return numberWithCommas.toFixed(4);
    }
  }
  return val;
};
export const isSameAddress = (addr1, addr2) => {
  if (typeof addr1 !== 'string' || typeof addr2 !== 'string') return null;
  return addr1.toLowerCase() === addr2.toLowerCase();
};

export const getKeyedArray = (obj, keyName = 'field') => {
  if (!obj) {
    console.error('Receieved falsy value for object in getKeyedArray');
    return null;
  }
  if (isObjectEmpty(obj)) {
    console.warn('Object passed to getKeyedArray is Empty');
    return [];
  }
  return Object.entries(obj).map(item => ({ ...item[1], [keyName]: item[0] }));
};

export const isLastItem = (list, index) => index === list?.length - 1;
export const isFirstItem = (list, index) => index === 0;
export const generateNonce = () => `0x${randomBytes(32).toString('hex')}`;

export const NOUN = {
  SHARES: {
    singular: 'share',
    plural: 'shares',
  },
  LOOT: {
    singular: 'loot',
    plural: 'loot',
  },
  PROPOSALS: {
    singular: 'proposal',
    plural: 'proposals',
  },
  ADDRESSES: {
    singular: 'address',
    plural: 'addresses',
  },
};

export const handleNounCase = (amt, noun) =>
  Number(amt) === 1 ? noun.singular : noun.plural;

export const handleJsonEscaping = obj => {
  return JSON.stringify(obj)
    .replace(/\\n/g, '\\n')
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, '\\&')
    .replace(/\\r/g, '\\r')
    .replace(/\\t/g, '\\t')
    .replace(/\\b/g, '\\b')
    .replace(/\\f/g, '\\f');
};
