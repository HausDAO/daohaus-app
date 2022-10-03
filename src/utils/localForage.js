import localforage from 'localforage';
// developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
// developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria
// localforage.github.io/localForage/#localforage

const abiStore = {
  '0x1': {},
  '0x5': {},
  '0xa': {},
  '0x64': {},
  '0x89': {},
  '0xa4b1': {},
  '0xa4ec': {},
};
const ABI_STORE = 'ABI Store';
/// /////

const getlocalForage = async storeName => {
  try {
    const store = await localforage.getItem(storeName);
    return store;
  } catch (error) {
    console.error(error);
  }
};

export const getABIstore = () => getlocalForage(ABI_STORE);

export const getCachedABI = async ({ contractAddress, chainID }) => {
  if ((!chainID, !contractAddress)) return;
  const abiStore = await getABIstore();
  return abiStore?.[chainID]?.[contractAddress];
};

const addABI = ({ abiStore, chainID, contractAddress, abi }) => {
  return {
    ...abiStore,
    [chainID]: {
      ...abiStore[chainID],
      [contractAddress]: abi,
    },
  };
};

export const cacheABI = async ({ contractAddress, chainID, abi }) => {
  const abiStore = await getABIstore();
  const newStore = addABI({ abiStore, contractAddress, chainID, abi });
  try {
    await localforage.setItem(ABI_STORE, newStore);
    return true;
  } catch (error) {
    console.error(error);
  }
};

const init = async () => {
  localforage.config({
    // driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
    name: 'daohaus_app',
    version: 1.0,
    // size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: 'daohaus_ABI_cache_1', // Should be alphanumeric, with underscores.
    description: 'where we store the ABIs, ok?',
  });
  const store = await getABIstore();
  if (!store) {
    localforage.setItem(ABI_STORE, abiStore);
  }
};
init();

// cacheABI({
//   contractAddress: '0xE6421E9aF92aca6a81C9fD0BAbacE4a9c5691c60',
//   chainID: '0x64',
//   abi: 'Jimmy test',
// });
