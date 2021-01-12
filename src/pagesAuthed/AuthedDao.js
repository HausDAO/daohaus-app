import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Layout from "../components/layout";
import AuthedDaoRoutes from "../routers/authedDaoRoutes";
import { useCustomTheme } from "../contexts/CustomThemeContext";

const AuthedDao = () => {
  const [linkCopy, setLinkCopy] = useState();
  const { daochain, daoid } = useParams();
  const { customCopy } = useCustomTheme();

  useEffect(() => {
    setLinkCopy(customCopy);
  }, [customCopy]);

  const sideMenu = (
    <nav>
      <Link to={`/dao/${daochain}/${daoid}`}>Overview</Link>
      <Link to={`/dao/${daochain}/${daoid}/proposals`}>
        {linkCopy ? linkCopy["proposals"] : "Proposals"}
      </Link>
      <Link to={`/dao/${daochain}/${daoid}/bank`}>
        {linkCopy ? linkCopy["bank"] : "Proposals"}
      </Link>
      <Link to={`/dao/${daochain}/${daoid}/members`}>
        {linkCopy ? linkCopy["members"] : "Proposals"}
      </Link>
      <Link to={`/dao/${daochain}/${daoid}/settings`}>Settings</Link>
      <Link to={`/hub`}>Hub</Link>
    </nav>
  );

  return (
    <Layout sideMenu={sideMenu}>
      <AuthedDaoRoutes />
    </Layout>
  );
};

export default AuthedDao;
