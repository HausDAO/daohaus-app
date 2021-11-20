import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Flex,
  Box,
  Button,
  Skeleton,
  Badge,
  Icon,
  Divider,
  Progress,
} from '@chakra-ui/react';
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
import { ParaMd, ParaSm } from './contentBuilder/typography';

const SAMPLE = {
  id: 'SAMPLE',

  content: [
    { type: 'cardlabel', text: 'funding proposal', mb: '1' },
    // { type: 'label', text: 'This is a Label' },
    // { type: 'heading', text: 'This is a Heading' },
    { type: 'par', text: 'Takahashi wants in', fontWeight: '700' },
    // { type: 'smallPars', text: 'This is smallText' },
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
    <ContentBox p='0'>
      <Flex>
        <Flex
          width='60%'
          justifyContent='space-between'
          borderRight='1px solid rgba(255,255,255,0.3)'
        >
          <Box px='1.2rem' py='0.6rem'>
            <ContentBuilder {...SAMPLE} />
          </Box>
          <Box px='1.2rem' py='0.6rem'>
            <Button
              variant='ghost'
              p='0'
              size='sm'
              fontSize='.85rem'
              fontWeight='600'
              color='secondary.400'
              transform='translateY(-.4rem)'
            >
              More Details
            </Button>
          </Box>
        </Flex>
        <Divider color='white' orientation='vertical' h='100%' />
        <Flex w='40%'>
          <Box px='1.2rem' py='0.6rem' w='100%'>
            <Flex alignItems='center' mb={3}>
              <Box
                borderRadius='50%'
                background='green'
                h='.6rem'
                w='.6rem'
                mr='2'
              />
              <ParaSm fontWeight='700' mr='1'>
                Passed
              </ParaSm>
              <ParaSm>and needs execution </ParaSm>
            </Flex>
            <Progress value={80} mb='3' colorScheme='secondary.500' />
            <Flex justifyContent='space-between'>
              <Button
                size='sm'
                minW='64px'
                backgroundColor='white'
                color='black'
              >
                No
              </Button>
              <Button
                size='sm'
                minW='64px'
                color='secondary.500'
                variant='outline'
              >
                Abstain
              </Button>
              <Button size='sm' minW='64px'>
                Yes
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
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
