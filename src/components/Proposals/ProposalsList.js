import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';
import ProposalCard from './ProposalCard';

const ProposalsList = ({ proposals }) => {
  const [filter] = useState(null);
  const [theme] = useTheme();
  const [_proposals, setProposals] = useState(null);

  useEffect(() => {
    if (proposals.length > 0) {
      setProposals(proposals);
    } else {
      setProposals([]);
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
              <span style={{ color: theme.colors.brand[50] }}>
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
              <span style={{ color: theme.colors.brand[50] }}> filter</span>
            </Text>
          )}
          <Text
            ml={8}
            textTransform='uppercase'
            fontSize='sm'
            fontFamily={theme.fonts.heading}
          >
            Sort by:
            <span style={{ color: theme.colors.brand[50] }}>
              {' '}
              Voting Period
            </span>
          </Text>
        </Flex>
        {_proposals &&
          _proposals.slice(0, 5).map((proposal) => {
            return <ProposalCard proposal={proposal} key={proposal.id} />;
          })}
      </Box>
    </>
  );
};

export default ProposalsList;
