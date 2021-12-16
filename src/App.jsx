import React from 'react';

import { UserContextProvider } from './contexts/UserContext';
import DaoSwitcherModal from './modals/daoSwitcherModal';
import TxInfoModal from './modals/TxInfoModal';
import BaseRouter from './routers/baseRouter';

function App() {
  const AppScopedModals = () => (
    <>
      <DaoSwitcherModal />
      <TxInfoModal />
    </>
  );

  return (
    <UserContextProvider>
      <BaseRouter />
      <AppScopedModals />
    </UserContextProvider>
  );
}

export default App;
