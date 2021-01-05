import React from "react";

import Layout from "../components/layout";
import { DaoProvider } from "../contexts/DaoContext";
import AuthedDaoRoutes from "../routers/authedDaoRoutes";

const AuthedDao = () => {
  return (
    <DaoProvider>
      <Layout>
        <AuthedDaoRoutes />
      </Layout>
    </DaoProvider>
  );
};

export default AuthedDao;
