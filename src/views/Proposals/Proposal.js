import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Text, Link, Icon } from '@chakra-ui/core';

import { useProposals, useDao, useTheme } from '../../contexts/PokemolContext';
import ProposalDetail from '../../components/Proposals/ProposalDetail';

const Proposal = () => {
  const [dao] = useDao();
  const location = useLocation();
  const id = location.pathname.split('/proposals/')[1];
  const [proposals] = useProposals();
  const [proposal, setProposal] = useState(null);
  const [theme] = useTheme();

  useEffect(() => {
    if (proposals) {
      const p = proposals?.filter((p) => {
        return p.proposalId === id;
      })[0];

      setProposal(p);
    }
  }, [proposals]);
  console.log(proposal);

  return (
    <Box>
      <Box w='60%' p={6}>
        <Link as={RouterLink} to={`/dao/${dao?.address}/proposals`}>
          <Text textTransform='uppercase'>
            <Icon name='arrow-back' color={theme.colors.brand[50]} /> All Quests
          </Text>
        </Link>
        {proposal && <ProposalDetail proposal={proposal} />}
      </Box>
    </Box>
  );
};

export default Proposal;
