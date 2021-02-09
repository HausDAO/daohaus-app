import { formatDistanceToNow } from 'date-fns';

export const pipe = (...fns) => (x) =>
  fns.reduce((prev, func) => func(prev), x);

export const parseIfJSON = (data) => {
  try {
    const JSONdata = JSON.parse(data);
    return JSONdata;
  } catch {
    return data;
  }
};

export const IsJsonString = (str) => {
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

export const detailsToJSON = (values) => {
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
  return JSON.stringify(details);
};

// omits key/pairs from objects
export const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

export const numberWithCommas = (num) => {
  const localNum = typeof num !== 'string' ? num.toString() : num;
  // drop zero after decimal
  const noZeroDec =
    parseInt(localNum.split('.')[1]) === 0 ? localNum.split('.')[0] : localNum;

  return noZeroDec.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

export const truncateAddr = (addr) => {
  return addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : null;
};
export const timeToNow = (time) => {
  return formatDistanceToNow(new Date(time * 1000), { addSuffix: true });
};

// export const formatCreatedAt = (createdAt) => {
//   return format(new Date(createdAt * 1000), "MMM dd, yyyy");
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

export const capitalize = (string) => {
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
