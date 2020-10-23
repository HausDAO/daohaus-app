import React from 'react';
import Web3Modal from 'web3modal';

import { providerOptions } from '../utils/Auth';
import { customTheme } from '../themes/theme';
import { getChainData } from '../utils/chains';

const PokemolContext = React.createContext();

// daodata, dao service, boosts
// global loading needed?
// more network info here and the other need to react off that
// now do we double up data from the graph here

const initialState = {
  user: null,
  dao: null,
  theme: customTheme(),
  network: getChainData(+process.env.REACT_APP_NETWORK_ID).network,
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
