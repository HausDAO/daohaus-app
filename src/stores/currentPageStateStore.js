let injectedProvider = null;
let outstandingTXs;
let userHubDaos;
let daoGraphData;
let daoMetaData;

export const setPageState = (type, val) => {
  if (type === 'injectedProvider') {
    injectedProvider = val;
    console.log('set InjectedProvider in store', injectedProvider);
  }
};

export const getState = (type) => {
  if (type === 'injectedProvider') return injectedProvider;
};

export const dumpAllState = () => ({
  injectedProvider,
  outstandingTXs,
  userHubDaos,
  daoGraphData,
  daoMetaData,
});
