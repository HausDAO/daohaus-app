import React from 'react';

import { useParams } from 'react-router-dom';
import Layout from '../components/layout';
import { useDaoMember } from '../contexts/DaoMemberContext';

import DaoRouter from '../routers/daoRouter';
import { useMetaData } from '../contexts/MetaDataContext';
import DaoAccountModal from '../modals/daoAccountModal';

const Dao = () => {
  const { daoid, daochain } = useParams();
  const { daoMember } = useDaoMember();
  const { daoMetaData } = useMetaData();

  const DaoScopedModals = () => (
    <>
      <DaoAccountModal />
    </>
  );

  const dao = { daoID: daoid, chainID: daochain, daoMetaData, daoMember };

  return (
    <>
      <Layout dao={dao}>
        <DaoRouter />
        <DaoScopedModals />
      </Layout>
    </>
  );
};

export default Dao;
