import { formatDistanceToNow } from "date-fns";

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
  return Math.random().toString(36).slice(2);
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

//omits key/pairs from objects
export const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

export const numberWithCommas = (num) => {
  // drop zero after decimal
  const noZeroDec = parseInt(num.split(".")[1]) === 0 ? num.split(".")[0] : num;

  return noZeroDec.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const truncateAddr = (addr) => {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : null;
};
export const timeToNow = (time) => {
  return formatDistanceToNow(new Date(time * 1000), { addSuffix: true });
};
