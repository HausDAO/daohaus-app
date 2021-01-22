import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { CustomThemeContextProvider } from './contexts/CustomThemeContext';
import './index.css';

const Index = () => {
  return (
    <CustomThemeContextProvider>
      <App />
    </CustomThemeContextProvider>
  );
};
ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
