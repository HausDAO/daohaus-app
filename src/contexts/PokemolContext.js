import React, { useContext, useCallback, useMemo } from 'react';
import Web3Modal from 'web3modal';

import { providerOptions } from '../utils/Auth';
import { customTheme } from '../themes/theme';
import supportedChains, { getChainData } from '../utils/chains';

const PokemolContext = React.createContext();

function usePokemolContext() {
  return useContext(PokemolContext);
}

const initialState = {
  loading: false,
  user: null,
  dao: null,
  theme: customTheme(),
  network: supportedChains[42],
  txProcessor: null,
  userWallet: null,
  web3Connect: {
    w3c: new Web3Modal({
      network: getChainData(+process.env.REACT_APP_NETWORK_ID).network,
      providerOptions,
      cacheProvider: true,
    }),
  },
  proposals: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setLoading': {
      return { ...state, loading: action.payload };
    }
    case 'setUser': {
      return { ...state, user: action.payload };
    }
    case 'setTheme': {
      return { ...state, theme: customTheme(action.payload) };
    }
    case 'setWeb3Connect': {
      return { ...state, web3Connect: action.payload };
    }
    case 'setTxProcessor': {
      return { ...state, txProcessor: action.payload };
    }
    case 'setDao': {
      return { ...state, dao: action.payload };
    }
    case 'setUserWallet': {
      return { ...state, userWallet: action.payload };
    }
    case 'setProposals': {
      return { ...state, proposals: action.payload };
    }
    default: {
      return initialState;
    }
  }
};

function PokemolContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const updateLoading = useCallback((loading) => {
    dispatch({ type: 'setLoading', payload: loading });
  }, []);

  const updateUser = useCallback((user) => {
    dispatch({ type: 'setUser', payload: user });
  }, []);

  const updateDao = useCallback((dao) => {
    dispatch({ type: 'setDao', payload: dao });
  }, []);

  const updateTheme = useCallback((theme) => {
    dispatch({ type: 'setTheme', payload: theme });
  }, []);

  const updateWeb3Connect = useCallback((data) => {
    dispatch({ type: 'setWeb3Connect', payload: data });
  }, []);

  const updateNetwork = useCallback((network) => {
    dispatch({ type: 'setNetwork', payload: network });
  }, []);

  const updateTxProcessor = useCallback((tx) => {
    dispatch({ type: 'setTxProcessor', payload: tx });
  }, []);

  const updateUserWallet = useCallback((wallet) => {
    dispatch({ type: 'setUserWallet', payload: wallet });
  }, []);

  const updateProposals = useCallback((data) => {
    dispatch({ type: 'setProposals', payload: data });
  }, []);

  return (
    <PokemolContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateLoading,
            updateUser,
            updateDao,
            updateTheme,
            updateWeb3Connect,
            updateNetwork,
            updateTxProcessor,
            updateUserWallet,
            updateProposals,
          },
        ],
        [
          state,
          updateLoading,
          updateUser,
          updateDao,
          updateTheme,
          updateWeb3Connect,
          updateNetwork,
          updateTxProcessor,
          updateUserWallet,
          updateProposals,
        ],
      )}
    >
      {props.children}
    </PokemolContext.Provider>
  );
}

export function useUser() {
  const [state, { updateUser }] = usePokemolContext();
  return [state.user, updateUser];
}

export function useDao() {
  const [state, { updateDao }] = usePokemolContext();
  return [state.dao, updateDao];
}

export function useTheme() {
  const [state, { updateTheme }] = usePokemolContext();
  return [state.theme, updateTheme];
}

export function useNetwork() {
  const [state, { updateNetwork }] = usePokemolContext();
  return [state.network, updateNetwork];
}

export function useWeb3Connect() {
  const [state, { updateWeb3Connect }] = usePokemolContext();
  return [state.web3Connect, updateWeb3Connect];
}

export function useTxProcessor() {
  const [state, { updateTxProcessor }] = usePokemolContext();
  return [state.txProcessor, updateTxProcessor];
}

export function useUserWallet() {
  const [state, { updateUserWallet }] = usePokemolContext();
  return [state.txProcessor, updateUserWallet];
}

export function useLoading() {
  const [state, { updateLoading }] = usePokemolContext();
  return [state.loading, updateLoading];
}

export function useProposals() {
  const [state, { updateProposals }] = usePokemolContext();
  return [state.proposals, updateProposals];
}

const PokemolContextConsumer = PokemolContext.Consumer;

export { PokemolContext, PokemolContextProvider, PokemolContextConsumer };
