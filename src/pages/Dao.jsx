import React from 'react';
import { useParams } from 'react-router-dom';

import { DaoProvider } from '../contexts/DaoContext';
import DaoRouter from '../routers/daoRouter';
import DaoAccountModal from '../modals/daoAccountModal';
import Modal from '../modals/modal';
import ProposalSelector from '../modals/proposalSelector';

const Dao = () => {
  const { daoid } = useParams();

  const DaoScopedModals = () => (
    <>
      <DaoAccountModal />
      <ProposalSelector />
      <Modal />
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
