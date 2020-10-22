import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { PokemolContextProvider } from './contexts/PokemolContext';

import './index.css';

const Index = () => {
  return (
    <PokemolContextProvider>
      <App />
    </PokemolContextProvider>
  );
};
ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
