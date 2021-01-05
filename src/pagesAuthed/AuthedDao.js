import React from "react";

import Layout from "../components/layout";
import { useLocalDaoData } from "../contexts/DaoContext";
import AuthedDaoRoutes from "../routers/authedDaoRoutes";
import { HeaderSm } from "../styles/typography";

const AuthedDao = () => {
  const { daoOverview } = useLocalDaoData();

  const title = daoOverview ? daoOverview.moloch.title : "Loading...";

  return (
    <Layout sideMenu={<HeaderSm>{title}</HeaderSm>}>
      <AuthedDaoRoutes overview={daoOverview} title={title} />
    </Layout>
  );
};

export default AuthedDao;
