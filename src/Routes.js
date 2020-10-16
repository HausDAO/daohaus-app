import React from 'react';
import { Switch, Route } from 'react-router-dom';

import FourOhFour from './views/404/404';
import Hub from './views/hub/Hub';

const Routes = (props) => {
  const { isValid } = props;

  return (
    <>
      {isValid ? (
        <Switch>{/* <Route path="/" component={FourOhFour} /> */}</Switch>
      ) : (
        <Switch>
          <Route path="/" component={Hub} />
          <Route path="*" component={FourOhFour} />
        </Switch>
      )}
    </>
  );
};

export default Routes;
