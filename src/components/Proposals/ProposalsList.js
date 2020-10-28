import React, { useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';
import ProposalCard from './ProposalCard';

const ProposalsList = ({ proposals }) => {
  const [filter,] = useState(null);
  const [theme] = useTheme();
  //! remove the slice and deal with pagination
  return (
    <>
      <Box w='60%'>
        <Flex>
          {filter ? (
            <Text ml={8} textTransform='uppercase'>
              Filtered by:
              <span style={{ color: theme.colors.brand[50] }}>
                Action Needed
              </span>
            </Text>
          ) : (
            <Text
              ml={8}
              textTransform='uppercase'
              color={theme.colors.brand[50]}
              cursor='pointer'
            >
              Apply a filter
            </Text>
          )}
        </Flex>
        {proposals.slice(0, 5).map((proposal) => {
          return <ProposalCard proposal={proposal} key={proposal.id} />;
        })}
      </Box>
    </>
  );
};

export default ProposalsList;
