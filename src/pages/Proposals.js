import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
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

const Proposals = React.memo(function Proposals({
  overview,
  proposals,
  activities,
}) {
  // const { injectedProvider, address } = useInjectedProvider();
  // const { errorToast, successToast } = useOverlay();
  // const { theme } = useCustomTheme();
  // const { refreshDao } = useTX();

  // const testAddUser = () => {
  //   const hash = createHash();
  //   const details = detailsToJSON({
  //     title: 'Test!',
  //     description: 'Jordan is using this Contract to test the DaoHaus app',
  //     hash,
  //   });
  //   const from = address;
  //   const sampleData = [
  //     /* applicant */ from,
  //     /* sharesRequested: */ '0',
  //     /* lootRequested: */ '0',
  //     /* tributeOffered: */ '0',
  //     /* tributeToken: */ overview?.depositToken?.tokenAddress,
  //     /* paymentRequested: */ '10000000000000000000',
  //     /* paymentToken: */ overview?.depositToken?.tokenAddress,
  //     /* detailsObj */ details,
  //   ];
  //   const poll = createPoll({ action: 'submitProposal' })({
  //     daoID: daoid,
  //     chainID: daochain,
  //     hash,
  //     actions: {
  //       onError: (error) => {
  //         errorToast({
  //           title: `There was an error.`,
  //         });
  //         console.error(`Could not find a matching proposal: ${error}`);
  //       },
  //       onSuccess: () => {
  //         successToast({
  //           title: 'Proposal Submitted to the Dao!',
  //         });
  //         refreshDao();
  //         console.log(
  //           `Success: New proposal mined and cached on The Graph. We can now update the UI`,
  //         );
  //       },
  //     },
  //   });
  //   MolochService({
  //     web3: injectedProvider,
  //     daoAddress: daoid,
  //     chainID: daochain,
  //     version: overview?.version,
  //   })('submitProposal')(sampleData, from, poll);
  // };

  return (
    <Flex wrap='wrap'>
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
