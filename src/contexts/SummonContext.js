import React from 'react';

const SummonContext = React.createContext();

const initialState = {
  service: null,
  summonTx: null,
  status: 'new',
  errorMessage: null,
  contractAddress: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'resetAll': {
      return initialState;
    }
    case 'setService': {
      return { ...state, service: action.payload };
    }
    case 'setSummonTx': {
      return { ...state, summonTx: action.payload };
    }
    case 'setStatus': {
      return { ...state, status: action.payload };
    }
    case 'setError': {
      return { ...state, errorMessage: action.payload, status: 'error' };
    }
    case 'setComplete': {
      return { ...state, ...action.payload };
    }
    case 'clearState': {
      return {
        ...state,
        errorMessage: null,
        summonTx: null,
        status: 'new',
        contractAddress: null,
      };
    }
    default: {
      return initialState;
    }
  }
};

function SummonContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <SummonContext.Provider value={value}>
      {props.children}
    </SummonContext.Provider>
  );
}

const SummonContextConsumer = SummonContext.Consumer;

export { SummonContext, SummonContextProvider, SummonContextConsumer };
