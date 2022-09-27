import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useToken } from '../contexts/TokenContext';

// import Allies from '../pages/Allies';
import DiscourseSettings from '../pages/DiscourseSettings';
import Layout from '../components/layout';
import MarketPlaceV0 from '../pages/MarketPlaceV0';
import Members from '../pages/Members';
import Meta from '../pages/Meta';
import MetaAudit from '../pages/MetaAudit';
import MinionGallery from '../pages/MinionGallery';
import MinionVault from '../pages/MinionVault';
import MintGate from '../pages/MintGate';
import Notifications from '../pages/Notifications';
import Overview from '../pages/Overview';
import PartyFavor from '../pages/PartyFavor';
import Profile from '../pages/Profile';
import Proposal from '../pages/Proposal';
import Proposals from '../pages/Proposals';
import ProposalTypes from '../pages/ProposalTypes';
import ProposalAudit from '../pages/ProposalAudit';
import Settings from '../pages/Settings';
import Snapshot from '../pages/Snapshot';
import SnapshotSettings from '../pages/SnapshotSettings';
import SuperfluidMinion from '../pages/SuperfluidMinion';
import ThemeBuilder from '../pages/ThemeBuilder';
import Treasury from '../pages/Treasury';
import Vaults from '../pages/Vaults';
import ProposalsSpam from '../pages/ProposalsSpam';
import SpamFilterSettings from '../pages/SpamFilterSettings';
import DaoDocs from '../pages/daoDocs';
import DaoDoc from '../pages/DaoDoc';
import LitProtocolGoogle from '../pages/LitProtocolGoogle';

const DaoRouter = () => {
  const { path } = useRouteMatch();
  const { currentDaoTokens } = useToken();
  const {
    daoActivities,
    isCorrectNetwork,
    daoOverview,
    daoMembers,
    daoProposals,
    daoVaults,
  } = useDao();
  const { isMember, daoMember, delegate } = useDaoMember();

  const { daoid, daochain } = useParams();
  const { daoMetaData, customTerms, refetchMetaData } = useMetaData();
  const dao = {
    daoID: daoid,
    chainID: daochain,
    daoMetaData,
    daoMember,
    customTerms,
    daoProposals,
    daoVaults,
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
            daoMetaData={daoMetaData}
            daoVaults={daoVaults}
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
        <Route exact path={`${path}/vaults`}>
          <Vaults
            currentDaoTokens={currentDaoTokens}
            overview={daoOverview}
            customTerms={customTerms}
            daoVaults={daoVaults}
          />
        </Route>
        <Route exact path={`${path}/vaults/treasury`}>
          <Treasury
            currentDaoTokens={currentDaoTokens}
            overview={daoOverview}
            customTerms={customTerms}
            daoMember={daoMember}
            daoVaults={daoVaults}
          />
        </Route>
        <Route exact path={`${path}/vaults/minion/:minion`}>
          <MinionVault
            currentDaoTokens={currentDaoTokens}
            overview={daoOverview}
            customTerms={customTerms}
            daoMember={daoMember}
            daoVaults={daoVaults}
            isMember={isMember}
          />
        </Route>
        <Route
          exact
          path={[`${path}/gallery/minion/:minion`, `${path}/gallery/`]}
        >
          <MinionGallery daoVaults={daoVaults} customTerms={customTerms} />
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
          <MarketPlaceV0 />
        </Route>
        <Route exact path={`${path}/staking`}>
          <Redirect to='/' />
        </Route>
        <Route exact path={`${path}/settings/notifications`}>
          <Notifications
            daoMetaData={daoMetaData}
            refetchMetaData={refetchMetaData}
          />
        </Route>
        <Route exact path={`${path}/settings/discourse`}>
          <DiscourseSettings
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
        <Route exact path={`${path}/settings/audit`}>
          <MetaAudit daoMetaData={daoMetaData} />
        </Route>
        <Route exact path={`${path}/settings/proposals`}>
          <ProposalTypes
            daoMetaData={daoMetaData}
            refetchMetaData={refetchMetaData}
          />
        </Route>
        <Route exact path={`${path}/settings/spam`}>
          <SpamFilterSettings
            daoMetaData={daoMetaData}
            daoOverview={daoOverview}
          />
        </Route>
        <Route
          exact
          path={`${path}/settings/superfluid-minion/:minion`} // path={`${path}/settings/superfluid-minion/:minion(\b0x[0-9a-f]{10,40}\b)`}
        >
          <SuperfluidMinion
            activities={daoActivities}
            overview={daoOverview}
            daoMember={daoMember}
            members={daoMembers}
          />
        </Route>
        <Redirect
          from={`${path}/proposals/hardcore`}
          to={`${path}/proposals/audit`}
        />
        <Route exact path={`${path}/proposals/audit`}>
          <ProposalAudit daoProposals={daoProposals} />
        </Route>

        <Route exact path={`${path}/proposals/spam`}>
          <ProposalsSpam daoMetaData={daoMetaData} />
        </Route>
        <Route exact path={`${path}/proposals/:propid`}>
          <Proposal
            overview={daoOverview}
            daoMember={daoMember}
            activities={daoActivities}
            customTerms={customTerms}
            daoProposals={daoProposals}
            delegate={delegate}
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
        <Route exact path={`${path}/boost/mintgate`}>
          <MintGate daoMetaData={daoMetaData} />
        </Route>
        <Route exact path={`${path}/boost/snapshot/settings`}>
          <SnapshotSettings
            daoMetaData={daoMetaData}
            refetchMetaData={refetchMetaData}
          />
        </Route>
        <Route exact path={`${path}/boost/snapshot`}>
          <Snapshot
            isMember={isMember}
            daoMetaData={daoMetaData}
            refetchMetaData={refetchMetaData}
          />
        </Route>
        {/*
          TODO adding a flag to activate the LIT integration until the Lit team gets back to us
          see latest comments on https://github.com/HausDAO/daohaus-app/pull/1897 for more details.
        */}
        {process.env.REACT_APP_DEV && (
          <Route exact path={`${path}/boost/lit-protocol/google`}>
            <LitProtocolGoogle isMember={isMember} daoMetaData={daoMetaData} />
          </Route>
        )}
        <Route exact path={`${path}/party-favor`}>
          <PartyFavor isMember={isMember} />
        </Route>
        <Route exact path={`${path}/docs`}>
          <DaoDocs />
        </Route>
        <Route exact path={`${path}/doc/:docId`}>
          <DaoDoc />
        </Route>
      </Switch>
    </Layout>
  );
};

export default DaoRouter;
