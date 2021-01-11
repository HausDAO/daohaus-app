import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Layout from "../components/layout";
import { useLocalDaoData } from "../contexts/DaoContext";
import AuthedDaoRoutes from "../routers/authedDaoRoutes";
import { useMetaData } from "../contexts/MetaDataContext";

const AuthedDao = () => {
  const { daochain, daoid } = useParams();
  const sideMenu = (
    <nav>
      <Link to={`/dao/${daochain}/${daoid}`}>Overview</Link>
      <Link to={`/dao/${daochain}/${daoid}/proposals`}>Proposals</Link>
      <Link to={`/dao/${daochain}/${daoid}/bank`}>Bank</Link>
      <Link to={`/dao/${daochain}/${daoid}/members`}>Members</Link>
      <Link to={`/dao/${daochain}/${daoid}/settings`}>Settings</Link>
    </nav>
  );

  return (
    <Layout sideMenu={sideMenu}>
      <AuthedDaoRoutes />
    </Layout>
  );
};

export default AuthedDao;
