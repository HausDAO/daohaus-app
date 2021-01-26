import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import Bank from '../pages/Bank';
import Members from '../pages/Members';
import Overview from '../pages/Overview';
import Proposals from '../pages/Proposals';
import Profile from '../pages/Profile';
import Proposal from '../pages/Proposal';
import Settings from '../pages/Settings';
import { useToken } from '../contexts/TokenContext';

const DaoRouter = () => {
  const { path } = useRouteMatch();
  const { currentDaoTokens } = useToken();

  const {
    daoActivities,
    isCorrectNetwork,
    daoBalances,
    daoOverview,
    daoMembers,
  } = useDao();
  const { isMember, daoMember } = useDaoMember();
  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <Overview
          activities={daoActivities}
          daoMember={daoMember}
          isMember={isMember}
          isCorrectNetwork={isCorrectNetwork}
          overview={daoOverview}
          members={daoMembers}
        />
      </Route>
      <Route exact path={`${path}/proposals`}>
        <Proposals
          proposals={daoActivities?.proposals}
          overview={daoOverview}
          activities={daoActivities}
        />
      </Route>
      <Route exact path={`${path}/bank`}>
        <Bank balances={daoBalances} />
      </Route>
      <Route exact path={`${path}/members`}>
        <Members members={daoMembers} activities={daoActivities} />
      </Route>
      <Route exact path={`${path}/settings`}>
        <Settings overview={daoOverview} />
      </Route>
      <Route exact path={`${path}/proposal/:propid`}>
        <Proposal activities={daoActivities} />
      </Route>
      <Route exact path={`${path}/profile/:userid`}>
        <Profile
          members={daoMembers}
          overview={daoOverview}
          daoTokens={currentDaoTokens}
          activities={daoActivities}
        />
      </Route>
    </Switch>
  );
};

export default DaoRouter;
