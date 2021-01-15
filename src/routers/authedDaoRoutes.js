import React from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import { useLocalDaoData } from "../contexts/DaoContext";
import Bank from "../pages/Bank";
import Members from "../pages/Members";
import Overview from "../pages/Overview";
import Proposals from "../pages/Proposals";

const AuthedDaoRoutes = () => {
  const { path } = useRouteMatch();
  const {
    daoActivities,
    isMember,
    isCorrectNetwork,
    daoBalances,
    daoOverview,
    daoProposals,
    daoMembers,
  } = useLocalDaoData();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <Overview
          activities={daoActivities}
          isMember={isMember}
          isCorrectNetwork={isCorrectNetwork}
          overview={daoOverview}
          members={daoMembers}
          authed
        />
      </Route>
      <Route exact path={`${path}/proposals`}>
        <Proposals proposals={daoProposals} overview={daoOverview} authed />
      </Route>
      <Route exact path={`${path}/bank`}>
        <Bank balances={daoBalances} authed />
      </Route>
      <Route exact path={`${path}/members`}>
        <Members members={daoMembers} authed />
      </Route>
    </Switch>
  );
};

export default AuthedDaoRoutes;
