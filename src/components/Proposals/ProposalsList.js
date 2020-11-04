import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';
import ProposalCard from './ProposalCard';
import { defaultProposals } from '../../utils/constants';

const ProposalsList = ({ proposals }) => {
  const [filter] = useState(null);
  const [theme] = useTheme();
  const [_proposals, setProposals] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (proposals.length > 0) {
      setProposals(proposals);
      setIsLoaded(true);
    } else {
      setProposals(defaultProposals);
    }
  }, [proposals]);
  //! remove the slice and deal with pagination
  return (
    <>
      <Box w='60%'>
        <Flex>
          {filter ? (
            <Text
              ml={8}
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
            >
              Filtered by:
              <span style={{ color: theme.colors.primary[50] }}>
                Action Needed
              </span>
            </Text>
          ) : (
            <Text
              ml={8}
              textTransform='uppercase'
              fontFamily={theme.fonts.heading}
              cursor='pointer'
            >
              Apply a
              <span style={{ color: theme.colors.primary[50] }}> filter</span>
            </Text>
          )}
          <Text
            ml={8}
            textTransform='uppercase'
            fontSize='sm'
            fontFamily={theme.fonts.heading}
          >
            Sort by:
            <span style={{ color: theme.colors.primary[50] }}>
              {' '}
              Voting Period
            </span>
          </Text>
        </Flex>
        {_proposals &&
          _proposals.slice(0, 5).map((proposal) => {
            return (
              <ProposalCard
                proposal={proposal}
                key={proposal.id}
                isLoaded={isLoaded}
              />
            );
          })}
      </Box>
    </>
  );
};

export default ProposalsList;
