import React, { useEffect, useContext, useMemo, useCallback } from 'react';
import Web3Modal from 'web3modal';

import { useToast } from '@chakra-ui/core';
import { getProfile } from '3box/lib/api';

import { createWeb3User, w3connect, providerOptions } from '../utils/Auth';
import { USER_TYPE } from '../utils/DaoService';
import { TxProcessorService } from '../utils/TxProcessorService';
import { customTheme } from '../themes/theme';
import supportedChains, { getChainData } from '../utils/chains';

const PokemolContext = React.createContext();

function usePokemolContext() {
  return useContext(PokemolContext);
}

// daodata, dao service, boosts
// global loading needed?
// more network info here and the other need to react off that
// now do we double up data from the graph here

const initialState = {
  user: null,
  dao: null,
  theme: customTheme(),
  network: supportedChains[42],
  txProcessor: null,
  web3: {
    w3c: new Web3Modal({
      network: getChainData(+process.env.REACT_APP_NETWORK_ID).network,
      providerOptions,
      cacheProvider: true,
    }),
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setUser': {
      return { ...state, user: action.payload };
    }
    case 'setTheme': {
      return { ...state, theme: customTheme(action.payload) };
    }
    case 'clearTheme': {
      return { ...state, theme: customTheme() };
    }
    case 'setWeb3': {
      return { ...state, web3: action.payload };
    }
    case 'setTxProcessor': {
      return { ...state, txProcessor: action.payload };
    }
    case 'setDao': {
      return { ...state, dao: action.payload };
    }
    case 'setNetwork': {
      return { ...state, network: action.payload };
    }
    default: {
      return initialState;
    }
  }
};

function PokemolContextProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // const value = { state, dispatch };

  const updateUser = useCallback((user) => {
    dispatch({ type: 'setUser', payload: user });
  }, []);

  const updateDaoData = useCallback((dao) => {
    dispatch({ type: 'setDao', payload: dao });
  }, []);

  const updateTheme = useCallback((theme) => {
    dispatch({ type: 'setTheme', payload: theme });
  }, []);

  const updateWeb3 = useCallback((data) => {
    dispatch({ type: 'setWeb3', payload: data });
  }, []);

  const updateNetwork = useCallback((network) => {
    dispatch({ type: 'setNetwork', payload: network });
  }, []);

  const updateTxProcessor = useCallback((tx) => {
    dispatch({ type: 'setTxProcessor', payload: tx });
  }, []);

  return (
    <PokemolContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateUser,
            updateDaoData,
            updateTheme,
            updateWeb3,
            updateNetwork,
            updateTxProcessor,
          },
        ],
        [
          state,
          updateUser,
          updateDaoData,
          updateTheme,
          updateWeb3,
          updateNetwork,
          updateTxProcessor,
        ],
      )}
    >
      {children}
    </PokemolContext.Provider>
  );
}

export function Updater() {
  const toast = useToast();
  const [
    { user, web3 },
    { updateTxProcessor, updateWeb3, updateUser },
  ] = usePokemolContext();

  // on account change, fetch all quests from firebase and save them in context
  useEffect(() => {
    async function getAccount(_user, _web3) {
      let loginType = localStorage.getItem('loginType') || USER_TYPE.READ_ONLY;
      if (_user && _user.type === loginType) {
        return;
      }

      if (web3.w3c.cachedProvider) {
        loginType = USER_TYPE.WEB3;
      }

      let user;
      let txProcessor;
      let providerConnect;
      try {
        console.log(`Initializing user type: ${loginType || 'read-only'}`);

        switch (loginType) {
          case USER_TYPE.WEB3: {
            if (web3.w3c.cachedProvider) {
              try {
                providerConnect = await w3connect(_web3);
              } catch (err) {
                console.log(err);

                toast({
                  title: 'Wrong Network',
                  position: 'top-right',
                  description: err.msg,
                  status: 'warning',
                  duration: 9000,
                  isClosable: true,
                });
              }

              // error here - is it expected?
              const { w3c, web3, provider } = providerConnect;
              const [account] = await web3.eth.getAccounts();

              updateWeb3({ w3c, web3, provider });

              user = createWeb3User(account);

              txProcessor = new TxProcessorService(web3);
              txProcessor.update(user.username);
              txProcessor.forceUpdate =
                txProcessor.getTxPendingList(user.username).length > 0;

              const profile = await getProfile(user.username);
              updateUser({ ...user, ...profile });

              updateTxProcessor(txProcessor);

              web3.eth.subscribe('newBlockHeaders', async (error, result) => {
                if (!error) {
                  if (txProcessor.forceUpdate) {
                    await txProcessor.update(user.username);

                    if (!txProcessor.getTxPendingList(user.username).length) {
                      txProcessor.forceUpdate = false;
                    }

                    updateTxProcessor(txProcessor);
                  }
                }
              });
            }
            break;
          }
          case USER_TYPE.READ_ONLY:
          default:
            break;
        }

        localStorage.setItem('loginType', loginType);
      } catch (e) {
        console.error(
          `Could not log in with loginType ${loginType}: ${e.toString()}`,
        );

        localStorage.setItem('loginType', '');
      }
    }
    // console.log(account);
    if (user) {
      getAccount(user);
    }
  }, [user]);

  return null;
}

export function useUser() {
  const [state, { updateUser }] = usePokemolContext();
  return [state.user, updateUser];
}

export function useDaoData() {
  const [state, { updateDaoData }] = usePokemolContext();
  return [state.dao, updateDaoData];
}

export function useTheme() {
  const [state, { updateTheme }] = usePokemolContext();
  return [state.theme, updateTheme];
}

export function useNetwork() {
  const [state, { updateNetwork }] = usePokemolContext();
  return [state.network, updateNetwork];
}

export function useWeb3() {
  const [state, { updateWeb3 }] = usePokemolContext();
  return [state.web3, updateWeb3];
}

export function useTxProcessor() {
  const [state, { updateTxProcssor }] = usePokemolContext();
  return [state.txProcessor, updateTxProcssor];
}

const PokemolContextConsumer = PokemolContext.Consumer;

export { PokemolContext, PokemolContextProvider, PokemolContextConsumer };
