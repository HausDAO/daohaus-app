import React, { useState, useEffect } from 'react';

import { useDao, useModals } from '../../contexts/PokemolContext';
import ProposalFormModal from '../../components/Modal/ProposalFormModal';

const NewToken = () => {
  const [dao] = useDao();
  const [, setTokenList] = useState(null);
  const [, setProposal] = useState(null);
  const { modals, openModal } = useModals();
  openModal('newToken');
  useEffect(() => {
    if (dao?.graphData?.tokenBalances) {
      setTokenList(dao.graphData.tokenBalances);
    }
  }, [dao]);

  return (
    <>
      <ProposalFormModal
        submitProposal={setProposal}
        isOpen={modals.newToken}
        proposalType={'whitelist'}
        returnRoute={`/dao/${dao?.address}/bank`}
      />
    </>
  );
};

export default NewToken;
