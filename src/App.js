import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { UserContextProvider } from './contexts/UserContext';
import { ExploreContextProvider } from './contexts/ExploreContext';
import { DaoProvider } from './contexts/DaoContext';
import Hub from './pages/Hub';
import Dao from './pages/Dao';
import Explore from './pages/Explore';
import Summon from './pages/Summon';
import Register from './pages/Register';
import DaoSwitcherModal from './modals/daoSwitcherModal';
import TxInfoModal from './modals/TxInfoModal';

function App() {
  const AppScopedModals = () => (
    <>
      <DaoSwitcherModal />
      <TxInfoModal />
    </>
  );

  return (
    <UserContextProvider>
      <Switch>
        <Route exact path='/'>
          <Hub />
        </Route>
        <Route exact path='/explore'>
          <ExploreContextProvider>
            <Explore />
          </ExploreContextProvider>
        </Route>
        <Route exact path='/summon'>
          <Summon />
        </Route>
        <Route exact path='/register/:registerchain/:registerid'>
          <Register />
        </Route>
        <Route path='/dao/:daochain/:daoid'>
          <DaoProvider>
            <Dao />
          </DaoProvider>
        </Route>
      </Switch>
      <AppScopedModals />
    </UserContextProvider>
  );
}

export default App;
