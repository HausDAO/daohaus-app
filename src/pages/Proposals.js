import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
// import { useParams, Link } from 'react-router-dom';
// import { utils } from 'web3';

// // import { useCustomTheme } from '../contexts/CustomThemeContext';
// // import { useInjectedProvider } from '../contexts/InjectedProviderContext';
// // import { useTX } from '../contexts/TXContext';
// // import { MolochService } from '../services/molochService';
// import {
//   // createHash,
//   // detailsToJSON,
//   numberWithCommas,
//   timeToNow,
// } from '../utils/general';
// // import { createPoll } from '../services/pollService';

// import {
//   determineProposalStatus,
//   determineProposalType,
//   titleMaker,
//   descriptionMaker,
// } from '../utils/proposalUtils';
// import { useOverlay } from '../contexts/OverlayContext';
import ActivitiesFeed from '../components/activitiesFeed';
import ProposalCard from '../components/proposalCard';
import { getProposalsActivites } from '../utils/activities';
import { createHash, detailsToJSON } from '../utils/general';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { createPoll } from '../services/pollService';
import { useParams } from 'react-router-dom';
import { MolochService } from '../services/molochService';
import { useUser } from '../contexts/UserContext';

const Proposals = React.memo(function Proposals({
  overview,
  proposals,
  activities,
}) {
  const { injectedProvider, address } = useInjectedProvider();
  const { errorToast, successToast } = useOverlay();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();
  const { daoid, daochain } = useParams();

  const testAddUser = () => {
    const hash = createHash();
    const details = detailsToJSON({
      title: 'Test!',
      description: 'Jordan is using this Contract to test the DaoHaus app',
      hash,
    });

    const from = address;
    const sampleData = [
      /* applicant */ from,
      /* sharesRequested: */ '0',
      /* lootRequested: */ '0',
      /* tributeOffered: */ '0',
      /* tributeToken: */ overview?.depositToken?.tokenAddress,
      /* paymentRequested: */ '10000000000000000000',
      /* paymentToken: */ overview?.depositToken?.tokenAddress,
      /* detailsObj */ details,
    ];
    const poll = createPoll({ action: 'submitProposal', cachePoll })({
      daoID: daoid,
      chainID: daochain,
      hash,
      actions: {
        onError: (error, txHash) => {
          errorToast({
            title: `There was an error.`,
          });
          resolvePoll(txHash);
          console.error(`Could not find a matching proposal: ${error}`);
        },
        onSuccess: (txHash) => {
          successToast({
            title: 'Proposal Submitted to the Dao!',
          });
          refreshDao();
          resolvePoll(txHash);
        },
      },
    });
    MolochService({
      web3: injectedProvider,
      daoAddress: daoid,
      chainID: daochain,
      version: overview?.version,
    })('submitProposal')(sampleData, from, poll);
  };

  return (
    <Flex wrap='wrap'>
      <Button onClick={testAddUser}></Button>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        {proposals &&
          proposals
            .slice(0, 5)
            .map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
      </Box>

      <Box w={['100%', null, null, null, '40%']}>
        <ActivitiesFeed
          limit={5}
          activities={activities}
          hydrateFn={getProposalsActivites}
        />
      </Box>
    </Flex>
  );
});

export default Proposals;
