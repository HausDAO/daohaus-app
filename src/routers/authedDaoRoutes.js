import React from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import { useLocalDaoData } from "../contexts/DaoContext";
import Bank from "../pages/Bank";
import Members from "../pages/Members";
import Overview from "../pages/Overview";
import Proposals from "../pages/Proposals";

const AuthedDaoRoutes = ({ overview, title }) => {
  const { path } = useRouteMatch();
  const {
    daoActivities,
    isMember,
    isCorrectNetwork,
    daoBalances,
    daoProposals,
    daoMembers,
    daoOverview,
  } = useLocalDaoData();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <Overview
          activities={daoActivities}
          isMember={isMember}
          isCorrectNetwork={isCorrectNetwork}
          overview={overview}
          title={title}
        />
      </Route>
      <Route exact path={`${path}/proposals`}>
        <Proposals />
      </Route>
      <Route exact path={`${path}/bank`}>
        <Bank />
      </Route>
      <Route exact path={`${path}/members`}>
        <Members />
      </Route>
    </Switch>
  );
};

export default AuthedDaoRoutes;
