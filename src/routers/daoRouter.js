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
import Minion from '../pages/Minion';
import ThemeBuilder from '../pages/ThemeBuilder';
import { useToken } from '../contexts/TokenContext';
import Layout from '../components/layout';
import { useMetaData } from '../contexts/MetaDataContext';
import Meta from '../pages/Meta';
import Notifications from '../pages/Notifications';

const DaoRouter = () => {
  const { path } = useRouteMatch();
  const { currentDaoTokens } = useToken();

  const {
    daoActivities,
    isCorrectNetwork,
    daoOverview,
    daoMembers,
    daoProposals,
  } = useDao();
  const { isMember, daoMember } = useDaoMember();

  const { daoid, daochain } = useParams();
  const { daoMetaData, customTerms, refetchMetaData } = useMetaData();

  const dao = {
    daoID: daoid,
    chainID: daochain,
    daoMetaData,
    daoMember,
    customTerms,
    daoProposals,
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
            daoOverview={daoOverview}
            members={daoMembers}
            currentDaoTokens={currentDaoTokens}
          />
        </Route>
        <Route exact path={`${path}/proposals`}>
          <Proposals
            proposals={daoActivities?.proposals}
            overview={daoOverview}
            activities={daoActivities}
            customTerms={customTerms}
          />
        </Route>
        <Route exact path={`${path}/bank`}>
          <Bank
            currentDaoTokens={currentDaoTokens}
            overview={daoOverview}
            customTerms={customTerms}
            daoMember={daoMember}
          />
        </Route>
        <Route exact path={`${path}/members`}>
          <Members
            members={daoMembers}
            activities={daoActivities}
            overview={daoOverview}
            daoMember={daoMember}
            daoMembers={daoMembers}
            customTerms={customTerms}
            daoMetaData={daoMetaData}
          />
        </Route>

        <Route exact path={`${path}/settings/boosts`}>
          <Boosts customTerms={customTerms} />
        </Route>
        <Route exact path={`${path}/settings/notifications`}>
          <Notifications
            daoMetaData={daoMetaData}
            refetchMetaData={refetchMetaData}
          />
        </Route>
        <Route exact path={`${path}/settings/theme`}>
          <ThemeBuilder refetchMetaData={refetchMetaData} />
        </Route>
        <Route exact path={`${path}/settings`}>
          <Settings
            overview={daoOverview}
            daoMember={daoMember}
            daoMetaData={daoMetaData}
            customTerms={customTerms}
          />
        </Route>
        <Route exact path={`${path}/settings/meta`}>
          <Meta
            daoMetaData={daoMetaData}
            isMember={isMember}
            refetchMetaData={refetchMetaData}
          />
        </Route>
        <Route
          exact
          path={`${path}/settings/minion/:minion`} // path={`${path}/settings/minion/:minion(\b0x[0-9a-f]{10,40}\b)`}
        >
          <Minion
            overview={daoOverview}
            members={daoMembers}
            currentDaoTokens={currentDaoTokens}
          />
        </Route>
        <Route exact path={`${path}/allies`}>
          <Allies />
        </Route>
        <Route exact path={`${path}/proposals/new/:proposalType`}>
          <NewProposal customTerms={customTerms} daoMetaData={daoMetaData} />
        </Route>
        <Route exact path={`${path}/proposals/new`}>
          <NewProposal customTerms={customTerms} daoMetaData={daoMetaData} />
        </Route>
        <Route exact path={`${path}/proposals/:propid`}>
          <Proposal
            overview={daoOverview}
            daoMember={daoMember}
            activities={daoActivities}
            customTerms={customTerms}
            daoProposals={daoProposals}
          />
        </Route>
        <Route exact path={`${path}/profile/:userid`}>
          <Profile
            members={daoMembers}
            overview={daoOverview}
            daoTokens={currentDaoTokens}
            activities={daoActivities}
            daoMember={daoMember}
          />
        </Route>
      </Switch>
    </Layout>
  );
};

export default DaoRouter;
