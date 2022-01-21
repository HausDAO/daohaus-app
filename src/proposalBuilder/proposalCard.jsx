import React from 'react';
import { Flex, Center, Button } from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from '../components/ContentBox';
import PropActions from './proposalActionFactory';

import { getVoteData } from '../utils/proposalCard';
import useMinionAction from '../hooks/useMinionAction';
import ProposalCardBrief from './proposalBrief';

const ProposalCardV2 = ({ proposal, interaction }) => {
  const { address } = useInjectedProvider();
  const { daoMember, isMember } = useDaoMember();
  const { minionAction, executeTX } = proposal?.minion
    ? useMinionAction(proposal)
    : {};

  const { canInteract } = interaction || {};

  const voteData = getVoteData(proposal, address, daoMember);

  return (
    <ContentBox p='0' mb={4} minHeight='8.875rem'>
      <Flex flexDir={['column', 'column', 'row']}>
        <ProposalCardBrief proposal={proposal} minionAction={minionAction} />
        <Center minHeight={['0', '0', '8.875rem']} />
        <Flex
          w={['100%', '100%', '45%']}
          mb={['4', '4', '0', '0']}
          mt={['4', '4', '0']}
        >
          <PropActions
            proposal={proposal}
            canInteract={canInteract}
            voteData={voteData}
            isMember={isMember}
            minionAction={minionAction}
            executeTX={executeTX}
          />
        </Flex>
        <Flex
          justifyContent='center'
          w='100%'
          display={['flex', 'flex', 'none']}
          mb='6'
        >
          <Button
            variant='outline'
            size='lg'
            width='10rem'
            mt={['4', '4', '0']}
          >
            More Details
          </Button>
        </Flex>
      </Flex>
    </ContentBox>
  );
};

export default ProposalCardV2;
