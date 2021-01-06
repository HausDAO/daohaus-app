export const parseIfJSON = (data) => {
  try {
    const JSONdata = JSON.parse(data);
    return JSONdata;
  } catch {
    return data;
  }
};

export const initReactSetter = (reactSet) => {
  return (fn) => {
    return (data) => {
      return reactSet(fn(data));
    };
  };
};
