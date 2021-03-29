import React from 'react';

import DaoRouter from '../routers/daoRouter';
import DaoAccountModal from '../modals/daoAccountModal';
import { DaoProvider } from '../contexts/DaoContext';
import { useParams } from 'react-router-dom';

const Dao = () => {
  const { daoid } = useParams();
  const DaoScopedModals = () => (
    <>
      <DaoAccountModal />
    </>
  );

  return (
    <DaoProvider key={daoid}>
      <DaoRouter />
      <DaoScopedModals />
    </DaoProvider>
  );
};

export default Dao;
