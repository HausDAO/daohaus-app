import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Icon } from '@chakra-ui/core';
import { RiArrowLeftLine } from 'react-icons/ri';

import { useProposals, useDao, useTheme } from '../../contexts/PokemolContext';
import ProposalDetail from '../../components/Proposals/ProposalDetail';
import ProposalVote from '../../components/Proposals/ProposalVote';
import ProposalActivityFeed from '../../components/Proposals/ProposalActivityFeed';

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
            <Box
              textTransform='uppercase'
              ml={6}
              fontSize='lg'
              fontFamily={theme.fonts.heading}
            >
              <Icon
                name='arrow-back'
                color={theme.colors.primary[50]}
                as={RiArrowLeftLine}
                h='20px'
                w='20px'
              />{' '}
              All {theme.daoMeta.proposals}
            </Box>
          </Link>
        </Box>
        <Box w='40%'>
          <Box
            textTransform='uppercase'
            fontSize='lg'
            fontFamily={theme.fonts.heading}
            fontWeight={700}
          >
            Vote
          </Box>
        </Box>
      </Flex>
      <Flex>
        <Box w='60%'>
          <ProposalDetail proposal={proposal} />
          <Flex w='100%' justify='center' align='center' h='40%'>
            <Box maxW='300px' textAlign='center'>
              There’s 6 more quests that need your attention. View all?
            </Box>
          </Flex>
        </Box>
        <Box w='40%'>
          <ProposalVote proposal={proposal} />
          <ProposalActivityFeed />
        </Box>
      </Flex>
    </Box>
  );
};

export default Proposal;
