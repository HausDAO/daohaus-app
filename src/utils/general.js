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

//wrapper function that combines react setter, with the a function to operater on the data
//and an argument for the data. 100% lazy initialized and executed. Can pass args to and from
//functions and components and fired whenever needed.

// const getAndSet = initReactSetter(setStateFn)(resolverFn)(data)();

export const initReactSetter = (reactSet) => (resolverFn) => (data) => () =>
  reactSet(resolverFn(data));

//omits key/pairs from objects
export const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

export const numberWithCommas = (num) => {
  // drop zero after decimal
  const noZeroDec = parseInt(num.split(".")[1]) === 0 ? num.split(".")[0] : num;

  return noZeroDec.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
