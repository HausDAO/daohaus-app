import React from 'react';
import { useParams } from 'react-router-dom';

import DaoRouter from '../routers/daoRouter';
import DaoAccountModal from '../modals/daoAccountModal';
import { DaoProvider } from '../contexts/DaoContext';
import ProposalSelector from '../modals/proposalSelector';

const Dao = () => {
  const { daoid } = useParams();
  const DaoScopedModals = () => (
    <>
      <DaoAccountModal />
      <ProposalSelector />
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
