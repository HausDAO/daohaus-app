import React, { useState, useEffect } from 'react';

import { useDao } from '../../contexts/PokemolContext';
import ProposalFormModal from '../../components/Modal/ProposalFormModal';
import { Flex, Box } from '@chakra-ui/react';
import MembersList from '../../components/Members/MembersList';
import MemberInfoCard from '../../components/Shared/MemberInfoCard/MemberInfoCard';
import MemberSnapshot from '../../components/Members/MemberSnapshot';
import MembersActivityFeed from '../../components/Members/MembersActivityFeed';

const NewMember = () => {
  const [selectedMember, setSelectedMember] = useState();
  const [dao] = useDao();
  const [, setTokenList] = useState(null);
  const [, setProposal] = useState(null);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (dao?.graphData?.tokenBalances) {
      setTokenList(dao.graphData.tokenBalances);
    }
  }, [dao]);

  return (
    <>
      <Flex p={6} wrap='wrap'>
        <Box
          w={['100%', null, null, null, '60%']}
          pr={[0, null, null, null, 6]}
        >
          <MembersList
            handleSelect={setSelectedMember}
            selectedMember={selectedMember}
          />
        </Box>
        <Box w={['100%', null, null, null, '40%']} pt={[6, 0]}>
          {selectedMember ? (
            <MemberInfoCard user={selectedMember} showMenu={true} />
          ) : (
            <MemberSnapshot selectedMember={selectedMember} />
          )}

          <MembersActivityFeed selectedMember={selectedMember} />
        </Box>
      </Flex>

      <ProposalFormModal
        submitProposal={setProposal}
        isOpen={showModal}
        setShowModal={setShowModal}
        proposalType={'whitelist'}
        returnRoute={`/dao/${dao?.address}/members`}
      />
    </>
  );
};

export default NewMember;
