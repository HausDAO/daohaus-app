import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { UserContextProvider } from './contexts/UserContext';
import { ExploreContextProvider } from './contexts/ExploreContext';
import Hub from './pages/Hub';
// import Dao from './pages/Dao';
// import Explore from './pages/Explore';
// import Summon from './pages/Summon';
import Register from './pages/Register';
import DaoSwitcherModal from './modals/daoSwitcherModal';
import TxInfoModal from './modals/TxInfoModal';
import FourOhFour from './pages/404';
import HubBalances from './pages/HubBalances';
import DaosquareCco from './pages/DaosquareCco';
import { DaosquareContextProvider } from './contexts/DaosquareCcoContext';

const Dao = lazy(() => import('./pages/Dao'));
const Explore = lazy(() => import('./pages/Explore'));
const Summon = lazy(() => import('./pages/Summon'));

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
        <Route exact path='/dao/:dao(\b0x[0-9a-f]{10,40}\b)/*'>
          <Redirect to='/' />
        </Route>
        <Route exact path='/cco'>
          <Redirect to='/dao/0x64/0x44f2f58eb410c3099d59db44e8ab9859e886c176/cco' />
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
        <Route exact path='/register/:registerchain/:daoid'>
          <Register />
        </Route>
        <Route exact path='/hub-balances'>
          <HubBalances />
        </Route>
        <Route exact path='/daosquare-incubator'>
          <DaosquareContextProvider>
            <DaosquareCco />
          </DaosquareContextProvider>
        </Route>
        <Route
          path='/dao/:daochain/:daoid'
          render={routeProps => {
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
