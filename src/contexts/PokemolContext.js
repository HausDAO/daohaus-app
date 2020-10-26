import React, { useContext, useMemo, useCallback } from 'react';
import Web3Modal from 'web3modal';

import { providerOptions } from '../utils/Auth';
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

  const updateTxProcssor = useCallback((tx) => {
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
            updateTxProcssor,
          },
        ],
        [
          state,
          updateUser,
          updateDaoData,
          updateTheme,
          updateWeb3,
          updateNetwork,
          updateTxProcssor,
        ],
      )}
    >
      {children}
    </PokemolContext.Provider>
  );
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
