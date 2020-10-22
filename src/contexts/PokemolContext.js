import React from 'react';

import { customTheme } from '../themes/theme';

const PokemolContext = React.createContext();

const initialState = {
  user: null,
  dao: null,
  theme: customTheme(),
  network: 'mainnet',
  web3: null,
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
