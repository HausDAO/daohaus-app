import { Flex, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ProposalFormModal from '../../components/Modal/ProposalFormModal';
import ProposalTypeModal from '../../components/Modal/ProposalTypeModal';
import ProposalsActivityFeed from '../../components/Proposals/ProposalsActivityFeed';
import ProposalsList from '../../components/Proposals/ProposalsList';
import { useDao } from '../../contexts/PokemolContext';

const validProposalType = (type) => {
  return [
    'member',
    'funding',
    'whitelist',
    'guildkick',
    'trade',
    'minion',
  ].includes(type);
};

const NewProposal = () => {
  const [dao] = useDao();
  const params = useParams();
  const history = useHistory();
  const [proposalType, setProposalType] = useState(null);
  const [, setProposal] = useState(null);
  const [showModal, setShowModal] = useState('proposal-type');

  useEffect(() => {
    if (params.type) {
      if (validProposalType(params.type)) {
        setShowModal('proposal');
        setProposalType(params.type);
      } else {
        history.push(`/dao/${params.dao}/proposals`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <>
      <ProposalTypeModal
        setProposalType={setProposalType}
        isOpen={showModal === 'proposal-type'}
        setShowModal={setShowModal}
        returnRoute={`/dao/${dao?.address}/proposals`}
      />
      <ProposalFormModal
        submitProposal={setProposal}
        isOpen={showModal === 'proposal'}
        setShowModal={setShowModal}
        proposalType={proposalType}
        returnRoute={`/dao/${dao?.address}/proposals`}
      />

      <Flex p={6} wrap='wrap'>
        <Box
          w={['100%', null, null, null, '60%']}
          pr={[0, null, null, null, 6]}
        >
          <ProposalsList />
        </Box>

        <Box w={['100%', null, null, null, '40%']} pt={[6, 0]}>
          <ProposalsActivityFeed />
        </Box>
      </Flex>
    </>
  );
};

export default NewProposal;
