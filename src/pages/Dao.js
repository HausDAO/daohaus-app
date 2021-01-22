import React, { useState, useEffect } from "react";
import { Flex, Box } from "@chakra-ui/react";
import {
  Link,
  useParams,
  Switch,
  Route,
  useRouteMatch,
  Redirect,
} from "react-router-dom";

import Layout from "../components/layout";
import { useCustomTheme } from "../contexts/CustomThemeContext";
import { useLocalDaoData } from "../contexts/DaoContext";
import { useDaoMember } from "../contexts/DaoMemberContext";
import Bank from "../pages/Bank";
import Members from "../pages/Members";
import Overview from "../pages/Overview";
import Proposals from "../pages/Proposals";
import Profile from "../pages/Profile";
import Proposal from "../pages/Proposal";
import Settings from "../pages/Settings";
import { useToken } from "../contexts/TokenContext";

const Dao = () => {
  const { path } = useRouteMatch();
  const { daochain, daoid } = useParams();
  const { currentDaoTokens } = useToken();

  const {
    daoActivities,
    isCorrectNetwork,
    daoBalances,
    daoOverview,
    daoMembers,
  } = useLocalDaoData();
  const { isMember, daoMember } = useDaoMember();
  const { customCopy } = useCustomTheme();

  const [linkCopy, setLinkCopy] = useState();

  useEffect(() => {
    setLinkCopy(customCopy);
  }, [customCopy]);

  const sideMenu = (
    <Box>
      <Flex direction="column">
        <Link className="nav-link" to={`/dao/${daochain}/${daoid}`}>
          Overview
        </Link>
        <Link className="nav-link" to={`/dao/${daochain}/${daoid}/proposals`}>
          {linkCopy ? linkCopy.proposals : "Proposals"}
        </Link>
        <Link className="nav-link" to={`/dao/${daochain}/${daoid}/bank`}>
          {linkCopy ? linkCopy.bank : "Proposals"}
        </Link>
        <Link className="nav-link" to={`/dao/${daochain}/${daoid}/members`}>
          {linkCopy ? linkCopy.members : "Proposals"}
        </Link>
        <Link className="nav-link" to={`/dao/${daochain}/${daoid}/settings`}>
          Settings
        </Link>
        <Link to={`/hub`} className="nav-link">
          Hub
        </Link>
      </Flex>
    </Box>
  );

  return (
    <Layout sideMenu={sideMenu} isCorrectNetwork={isCorrectNetwork}>
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
    </Layout>
  );
};

export default Dao;
