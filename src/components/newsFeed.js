import React, { useState, useEffect } from 'react';

import ProposalPreview from './proposalPreview';

import { useUser } from '../contexts/UserContext';
import { parseIfJSON } from '../utils/general';
import { Box } from '@chakra-ui/react';

const combineAndSortProposals = (daosByNetwork) => {
  return daosByNetwork
    .reduce((arr, network) => {
      return [
        ...arr,
        ...network.data.reduce((arr, dao) => {
          return [
            ...arr,
            ...dao.moloch.proposals.map((proposal) => ({
              ...proposal,
              createdAt: parseInt(proposal.createdAt),
              chain: network.name,
              details: parseIfJSON(proposal.details),
              name: dao.moloch.title,
            })),
          ];
        }, []),
      ];
    }, [])
    .sort((a, b) => b.createdAt - a.createdAt);
};

const NewsFeed = () => {
  const { userHubDaos, hasLoadedHubData } = useUser();

  const [newsFeed, setNewsFeed] = useState(null);
  const [viewing] = useState({ from: 0, to: 9 });

  useEffect(() => {
    if (hasLoadedHubData) {
      setNewsFeed(combineAndSortProposals(userHubDaos));
    }
  }, [userHubDaos, hasLoadedHubData]);

  return (
    <>
      <Box
        fontSize='md'
        fontFamily='heading'
        texttransform='uppercase'
        fontWeight={700}
      >
        Recent Activity
      </Box>
      {newsFeed &&
        newsFeed.slice(viewing.from, viewing.to + 1).map((proposal) => {
          return <ProposalPreview proposal={proposal} key={proposal.id} />;
        })}
    </>
  );
};

export default NewsFeed;
