import React from 'react';
import { Switch, Route } from 'react-router-dom';

import FourOhFour from './views/404/404';
import Hub from './views/hub/Hub';
import Dao from './views/Dao/Dao';

const Routes = () => {
  return (
    <>
      <Switch>
        <Route path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/" exact component={Dao} />
        <Route path="/" component={Hub} />
        <Route path="*" component={FourOhFour} />
      </Switch>
    </>
  );
};

export default Routes;
