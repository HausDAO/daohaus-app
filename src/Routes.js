import React from 'react';
import { Switch, Route } from 'react-router-dom';

import FourOhFour from './views/404/404';
import Hub from './views/Hub/Hub';
import Dao from './views/Dao/Dao';
import Proposals from './views/Proposals/Proposals';
import Proposal from './views/Proposals/Proposal';
import Members from './views/Members/Members';
import Profile from './views/Profile/Profile';
import Bank from './views/Bank/Bank';
import Settings from './views/Settings/Settings';
import Boosts from './views/Settings/Boosts';
import CustomTheme from './views/Settings/CustomTheme';
import Notifications from './views/Settings/Notifications';

const Routes = () => {
  return (
    <>
      <Switch>
        <Route path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/" exact component={Dao} />

        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposals"
          exact
          component={Proposals}
        />
        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposals/new"
          exact
          component={Proposals}
        />
        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposal/:id"
          exact
          component={Proposal}
        />

        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/members"
          exact
          component={Members}
        />

        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/profile"
          exact
          component={Profile}
        />

        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/bank"
          exact
          component={Bank}
        />

        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/settings"
          exact
          component={Settings}
        />
        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/settings/boosts"
          exact
          component={Boosts}
        />
        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/settings/theme"
          exact
          component={CustomTheme}
        />
        <Route
          path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/settings/notifications"
          exact
          component={Notifications}
        />

        <Route path="/" component={Hub} />
        <Route path="*" component={FourOhFour} />
      </Switch>
    </>
  );
};

export default Routes;
