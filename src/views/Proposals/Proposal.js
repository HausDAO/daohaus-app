import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Icon } from '@chakra-ui/core';
import { RiArrowLeftLine } from 'react-icons/ri';

import { useProposals, useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import ProposalDetail from '../../components/Proposals/ProposalDetail';
import ProposalVote from '../../components/Proposals/ProposalVote';
import ProposalHistory from '../../components/Proposals/ProposalHistory';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              fontFamily='heading'
            >
              <Icon
                name='arrow-back'
                color='primary.50'
                as={RiArrowLeftLine}
                h='20px'
                w='20px'
              />{' '}
              All {theme.daoMeta.proposals}
            </Box>
          </Link>
        </Box>
        <Box w='40%'>
          {!proposal?.cancelled && (
            <Box
              textTransform='uppercase'
              fontSize='lg'
              fontFamily='heading'
              fontWeight={700}
            >
              Vote
            </Box>
          )}
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
          {!proposal?.cancelled && <ProposalVote proposal={proposal} />}

          <ProposalHistory proposal={proposal} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Proposal;
