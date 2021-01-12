import React, { useState, useEffect } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

import Layout from "../components/layout";
import AuthedDaoRoutes from "../routers/authedDaoRoutes";
import { useCustomTheme } from "../contexts/CustomThemeContext";

const AuthedDao = () => {
  const [linkCopy, setLinkCopy] = useState();
  const { daochain, daoid } = useParams();
  const { customCopy } = useCustomTheme();

  //useEffect may not be necessary
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
    <Layout sideMenu={sideMenu}>
      <AuthedDaoRoutes />
    </Layout>
  );
};

export default AuthedDao;
