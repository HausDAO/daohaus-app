import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { UserContextProvider } from './contexts/UserContext';
import { ExploreContextProvider } from './contexts/ExploreContext';
import Hub from './pages/Hub';
import Dao from './pages/Dao';
import Explore from './pages/Explore';
import Summon from './pages/Summon';
import Register from './pages/Register';
import DaoSwitcherModal from './modals/daoSwitcherModal';
import TxInfoModal from './modals/TxInfoModal';
import FourOhFour from './pages/404';

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
        <Route exact path='/dao/:dao(\b0x[0-9a-f]{10,40}\b)'>
          <Redirect to='/' />
        </Route>
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
        <Route
          path='/dao/:daochain/:daoid'
          render={(routeProps) => {
            return <Dao key={routeProps.match.params.daoid} {...routeProps} />;
          }}
        />
        <Route path='*' component={FourOhFour} />
      </Switch>
      <AppScopedModals />
    </UserContextProvider>
  );
}

export default App;
