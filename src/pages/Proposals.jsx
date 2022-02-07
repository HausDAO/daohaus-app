import React from 'react';
import { RiAddFill } from 'react-icons/ri';
import { Box, Button, Flex } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import MainViewLayout from '../components/mainViewLayout';
import ProposalsList from '../components/proposalList';
import { getTerm, getTitle } from '../utils/metadata';
import useCanInteract from '../hooks/useCanInteract';

const Proposals = React.memo(({ proposals, customTerms }) => {
  const { setProposalSelector } = useOverlay();
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain', 'spamFilterMemberOnlyOff'],
  });

  const openProposalSelector = () => {
    setProposalSelector(true);
  };

  const ctaButton = canInteract && (
    <Button
      rightIcon={<RiAddFill />}
      title={getTitle(customTerms, 'Proposal')}
      onClick={openProposalSelector}
    >
      New {getTerm(customTerms, 'proposal')}
    </Button>
  );
  return (
    <MainViewLayout
      header='Proposals'
      headerEl={ctaButton}
      customTerms={customTerms}
      isDao
    >
      <Flex wrap='wrap'>
        <Box
          w={['100%', null, null, '100%', '80%']}
          pr={[0, null, null, null, 6]}
          pb={6}
        >
          <ProposalsList proposals={proposals} customTerms={customTerms} />
        </Box>
      </Flex>
    </MainViewLayout>
  );
});

export default Proposals;
