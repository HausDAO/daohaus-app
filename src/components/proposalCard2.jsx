import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Flex, Box, Button, Skeleton, Badge, Icon } from '@chakra-ui/react';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiDashboard2Line,
  RiDashboard3Line,
} from 'react-icons/ri';
import styled from '@emotion/styled';

import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { format } from 'date-fns';

import { numberWithCommas } from '../utils/general';
import {
  determineProposalStatus,
  getProposalCardDetailStatus,
  memberVote,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import ContentBox from './ContentBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { getCustomProposalTerm } from '../utils/metadata';
import ContentBuilder from './contentBuilder/contentBuilder';

const SAMPLE = {
  id: 'SAMPLE',
  content: [
    { type: 'label', text: 'This is a label' },
    { type: 'heading', text: 'This is a Heading' },
    { type: 'pars', text: 'This is a paragraph' },
  ],
};
// const formatStatus = status => {
//   return status.split(/(?=[A-Z])/).join(' ');
// };
const ProposalCardV2 = ({ proposal, customTerms }) => {
  // const { daochain, daoid } = useParams();
  // const { address } = useInjectedProvider();
  // const [status, setStatus] = useState(null);

  // useEffect(() => {
  //   if (proposal) {
  //     const statusStr = determineProposalStatus(proposal);
  //     setStatus(statusStr);
  //   }
  // }, [proposal]);

  return (
    <ContentBox key='0' mt={3} p='0'>
      <ContentBuilder {...SAMPLE} />
    </ContentBox>
  );
};

export default ProposalCardV2;

const things = (
  <Flex w='100%' wrap='wrap'>
    <Flex direction='column' w={['100%', null, null, '60%']} p={3}>
      <Flex justify='space-between'>
        <Box
          fontSize='xs'
          textTransform='uppercase'
          fontFamily='heading'
          letterSpacing='0.1em'
        >
          Proposal Type
        </Box>
        <Link to='/proposals'>
          <Box fontSize='xs' color='secondary.500'>
            <strong>More Details</strong>
          </Box>
        </Link>
      </Flex>
      <Box fontWeight={700} fontSize='sm' fontFamily='heading' mt={3}>
        This proposal title is intentionally long in order to test the limits of
        the layout.
      </Box>
      <Box mt={3}>
        <Flex align='center'>
          <RiArrowRightLine style={{ marginRight: '5px' }} /> Offering 1.5 WETH
        </Flex>
        <Flex align='center'>
          <RiArrowLeftLine style={{ marginRight: '5px' }} /> Requesting 100
          shares, 4900 Loot
        </Flex>
      </Box>
    </Flex>

    <Flex
      direction='column'
      w={['100%', null, null, '40%']}
      align='start'
      justify='space-between'
      borderLeft={['none', null, null, '1px solid rgba(255,255,255,0.2)']}
      borderTop={['1px solid rgba(255,255,255,0.2)', null, null, 'none']}
      p={3}
    >
      <Flex align='center' justify='space-between' w='100%'>
        <Box fontSize='xs'>
          <Badge mb='1'>Voting</Badge>
          <strong>
            <i>Voting</i>
          </strong>{' '}
          <i>ends in 5 hours</i>
        </Box>
        <Box fontSize='xl' color='secondary.500'>
          <RiDashboard3Line />
        </Box>
      </Flex>
      <Flex align='center' w='100%'>
        <Box
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255,255,255,0.25',
          }}
        />
      </Flex>
      <Flex w='100%' justify='space-between'>
        <Button variant='primary' size='sm'>
          No
        </Button>
        <Button variant='ghost' size='sm'>
          Abstain
        </Button>
        <Button variant='primary' size='sm'>
          Yes
        </Button>
      </Flex>
      <Flex align='center'>
        <Box fontSize='xs'>
          <i>Submit your vote</i>
        </Box>
      </Flex>
    </Flex>
  </Flex>
);
