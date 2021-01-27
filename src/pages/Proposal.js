import React from 'react';
import { useParams } from 'react-router-dom';
// import { utils } from 'web3';
import { Flex, Box } from '@chakra-ui/react';
import ActivitiesFeed from '../components/activitiesFeed';
import { getProposalHistories } from '../utils/activities';

// import { numberWithCommas, timeToNow } from '../utils/general';
import TextBox from '../components/TextBox';
import ContentBox from '../components/ContentBox';

import {
  // determineProposalStatus,
  determineProposalType,
  // titleMaker,
  // descriptionMaker,
} from '../utils/proposalUtils';

const Proposal = ({ activities }) => {
  const { propid } = useParams();
  const currentProposal = activities
    ? activities?.proposals?.find((proposal) => proposal.proposalId === propid)
    : null;

  return (
    <Box>
      <Flex wrap='wrap'>
        <Flex
          direction='column'
          w={['100%', null, null, null, '60%']}
          pr={[0, null, null, null, 6]}
        >
          <Box pt={6}>
            <ContentBox>
              <Box>
                <Box>
                  <Flex justify='space-between'>
                    <TextBox size='xs'>
                      {determineProposalType(currentProposal)}
                    </TextBox>
                  </Flex>
                </Box>
              </Box>
            </ContentBox>
          </Box>
        </Flex>
        <Flex
          direction='column'
          w={['100%', null, null, null, '40%']}
          pt={[6, 0]}
        >
          <Box>
            {!currentProposal?.cancelled && (
              <TextBox size='md'>Actions</TextBox>
            )}
          </Box>
          <Box pt={6}>
            {/* {!proposal?.cancelled && (
              <ProposalVote proposal={proposal} setProposal={setProposal} />
            )} */}
            <ActivitiesFeed
              limit={6}
              activities={currentProposal}
              hydrateFn={getProposalHistories}
            />
          </Box>
        </Flex>
        {/* <div key={currentProposal.id} className='large-box'>
            <p>{determineProposalType(currentProposal)}</p>
            <h3>{titleMaker(currentProposal)}</h3>
            <p>{descriptionMaker(currentProposal)}</p>
            <p>{determineProposalStatus(currentProposal)}</p>
            <p>{timeToNow(currentProposal.createdAt)}</p>
            <p>Yes: {currentProposal.yesShares}</p>
            <p>No: {currentProposal.noShares}</p>
            {currentProposal.paymentRequested > 0 && (
              <p>
                Payment Requested{' '}
                {numberWithCommas(
                  utils.fromWei(currentProposal.paymentRequested),
                )}
              </p>
            )}
          </div> */}
      </Flex>
    </Box>
  );
};

export default Proposal;
