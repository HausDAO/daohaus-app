import React, { useState } from 'react';

import ProposalFormModal from '../../components/Modal/ProposalFormModal';
import ProposalTypeModal from '../../components/Modal/ProposalTypeModal';

const NewProposal = () => {
  const [proposalType, setProposalType] = useState(null);
  const [, setProposal] = useState(null);
  const [showModal, setShowModal] = useState('proposal-type');

  return (
    <>
      <ProposalTypeModal
        setProposalType={setProposalType}
        isOpen={showModal === 'proposal-type'}
        setShowModal={setShowModal}
      />
      <ProposalFormModal
        submitProposal={setProposal}
        isOpen={showModal === 'proposal'}
        setShowModal={setShowModal}
        proposalType={proposalType}
      />
    </>
  );
};

export default NewProposal;
