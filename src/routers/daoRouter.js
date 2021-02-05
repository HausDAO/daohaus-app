import React from 'react';
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import Bank from '../pages/Bank';
import Members from '../pages/Members';
import Overview from '../pages/Overview';
import Proposals from '../pages/Proposals';
import Profile from '../pages/Profile';
import Proposal from '../pages/Proposal';
import NewProposal from '../pages/NewProposal';
import Settings from '../pages/Settings';
import Allies from '../pages/Allies';
import Boosts from '../pages/Boosts';
import { useToken } from '../contexts/TokenContext';
import Layout from '../components/layout';
import { useMetaData } from '../contexts/MetaDataContext';
import Meta from '../pages/Meta';

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

  const { daoid, daochain } = useParams();
  const { daoMetaData, customTerms } = useMetaData();

  const dao = {
    daoID: daoid,
    chainID: daochain,
    daoMetaData,
    daoMember,
    customTerms,
  };
  return (
    <Layout dao={dao}>
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

        <Route exact path={`${path}/settings/boosts`}>
          <Boosts />
        </Route>
        {/* <Route exact path={`${path}/settings/notifications`}>
          <Notifications />
        </Route> */}
        {/* <Route exact path={`${path}/settings/theme`}>
          <ThemeBuilder />
        </Route> */}
        <Route exact path={`${path}/settings`}>
          <Settings overview={daoOverview} />
        </Route>
        <Route exact path={`${path}/settings/meta`}>
          <Meta overview={daoOverview} />
        </Route>
        <Route exact path={`${path}/allies`}>
          <Allies />
        </Route>
        <Route exact path={`${path}/proposals/new/:proposalType`}>
          <NewProposal />
        </Route>
        <Route exact path={`${path}/proposals/new`}>
          <NewProposal />
        </Route>
        <Route exact path={`${path}/proposals/:propid`}>
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
    </Layout>
  );
};

export default DaoRouter;
