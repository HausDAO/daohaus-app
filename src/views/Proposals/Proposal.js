import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Icon } from '@chakra-ui/core';
import { RiArrowLeftLine } from 'react-icons/ri';

import TextBox from '../../components/Shared/TextBox';

import {
  useProposals,
  useDao,
  useRefetchQuery,
} from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import ProposalDetail from '../../components/Proposals/ProposalDetail';
import ProposalVote from '../../components/Proposals/ProposalVote';
import ProposalHistory from '../../components/Proposals/ProposalHistory';

const Proposal = () => {
  const [dao] = useDao();
  const [, updateRefetchQuery] = useRefetchQuery();
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

  useEffect(() => {
    const interval = setInterval(() => {
      updateRefetchQuery('proposals');
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <Box p={6}>
      <Flex wrap='wrap'>
        <Flex
          direction='column'
          w={['100%', null, null, null, '60%']}
          pr={[0, null, null, null, 6]}
        >
          <Link as={RouterLink} to={`/dao/${dao.address}/proposals`}>
            <TextBox size='md'>
              <Icon
                name='arrow-back'
                color='primary.50'
                as={RiArrowLeftLine}
                h='20px'
                w='20px'
              />{' '}
              All {theme.daoMeta.proposals}
            </TextBox>
          </Link>
          <Box pt={6}>
            <ProposalDetail proposal={proposal} />
          </Box>
          <Flex w='100%' justify='center' align='center' pt={6}>
            <Box maxW='300px' textAlign='center'>
              There’s 6 more quests that need your attention. View all?
            </Box>
          </Flex>
        </Flex>
        <Flex
          direction='column'
          w={['100%', null, null, null, '40%']}
          pt={[6, 0]}
        >
          <Box>{!proposal?.cancelled && <TextBox size='md'>Vote</TextBox>}</Box>
          <Box pt={6}>
            {!proposal?.cancelled && (
              <ProposalVote proposal={proposal} setProposal={setProposal} />
            )}
            <ProposalHistory proposal={proposal} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Proposal;
