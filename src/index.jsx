import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { HashRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { InjectedProvider } from './contexts/InjectedProviderContext';
import { CustomThemeProvider } from './contexts/CustomThemeContext';

window.onunload = () => {
  sessionStorage.clear();
};

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <CustomThemeProvider>
        <InjectedProvider>
          <App />
        </InjectedProvider>
      </CustomThemeProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
