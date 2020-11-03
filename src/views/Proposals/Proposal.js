import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Text, Link, Icon } from '@chakra-ui/core';

import { useProposals, useDao, useTheme } from '../../contexts/PokemolContext';
import ProposalDetail from '../../components/Proposals/ProposalDetail';
import ProposalVote from '../../components/Proposals/ProposalVote';

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
    // eslint-disable-next-line
  }, [proposals]);

  return (
    <Box>
      <Flex>
        <Box w='60%'>
          <Link as={RouterLink} to={`/dao/${dao.address}/proposals`}>
            <Text
              textTransform='uppercase'
              ml={6}
              fontSize='lg'
              fontFamily={theme.fonts.heading}
            >
              <Icon
                name='arrow-back'
                color={theme.colors.brand[50]}
                h='20px'
                w='20px'
              />{' '}
              All Quests
            </Text>
          </Link>
        </Box>
        <Box w='40%'>
          <Text
            textTransform='uppercase'
            fontSize='lg'
            fontFamily={theme.fonts.heading}
            fontWeight={700}
          >
            Vote
          </Text>
        </Box>
      </Flex>
      {proposal && (
        <Flex>
          <Box w='60%'>
            <ProposalDetail proposal={proposal} />
          </Box>
          <Box w='40%'>
            <ProposalVote proposal={proposal} />
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default Proposal;
