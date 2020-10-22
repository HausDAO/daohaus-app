import React from 'react';

const PokemolContext = React.createContext();

const initialState = {
  user: null,
  dao: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setUser': {
      return { ...state, user: action.payload };
    }
    case 'clearUser': {
      return { ...state, user: initialState.user };
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
