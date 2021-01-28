import React from 'react';

import { useParams } from 'react-router-dom';
import Layout from '../components/layout';
import { useDaoMember } from '../contexts/DaoMemberContext';

import DaoRouter from '../routers/daoRouter';
import { useMetaData } from '../contexts/MetaDataContext';

const Dao = () => {
  const { daoid, daochain } = useParams();
  const { daoMember } = useDaoMember();
  const { daoMetaData } = useMetaData();

  return (
    <Layout dao={{ daoID: daoid, chainID: daochain, daoMetaData, daoMember }}>
      <DaoRouter />
    </Layout>
  );
};

export default Dao;
