import React from 'react';

import DaoRouter from '../routers/daoRouter';
import DaoAccountModal from '../modals/daoAccountModal';
import { DaoProvider } from '../contexts/DaoContext';

const Dao = () => {
  const DaoScopedModals = () => (
    <>
      <DaoAccountModal />
    </>
  );

  return (
    <DaoProvider>
      <DaoRouter />
      <DaoScopedModals />
    </DaoProvider>
  );
};

export default Dao;
