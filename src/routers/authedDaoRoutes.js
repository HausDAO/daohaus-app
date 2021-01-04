import React from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import Proposals from "../pages/Proposals";

const AuthedDao = () => {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}/proposals`}>
        <Proposals />
      </Route>
      <Route exact path={`${path}/bank`}>
        //bank
      </Route>
      <Route exact path={`${path}/members`}>
        //members
      </Route>
    </Switch>
  );
};

export default AuthedDao;
