import React from 'react';
import Web3Modal from 'web3modal';

import { providerOptions } from '../utils/Auth';
import { customTheme } from '../themes/theme';
import { getChainData } from '../utils/chains';

const PokemolContext = React.createContext();

const initialState = {
  user: null,
  dao: null,
  theme: customTheme(),
  network: 'mainnet',
  txProcessor: null,
  web3: {
    w3c: new Web3Modal({
      network: getChainData(+process.env.REACT_APP_NETWORK_ID).network, // optional
      providerOptions, // required
      cacheProvider: true,
    }),
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setUser': {
      return { ...state, user: action.payload };
    }
    case 'clearUser': {
      return { ...state, user: initialState.user };
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
    default: {
      return initialState;
    }
  }
};

function PokemolContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <PokemolContext.Provider value={value}>
      {props.children}
    </PokemolContext.Provider>
  );
}

const PokemolContextConsumer = PokemolContext.Consumer;

export { PokemolContext, PokemolContextProvider, PokemolContextConsumer };
