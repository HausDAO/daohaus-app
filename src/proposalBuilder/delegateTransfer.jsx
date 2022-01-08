import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import AddressAvatar from '../components/addressAvatar';

import { useDao } from '../contexts/DaoContext';

import { AsyncCardTransfer } from './propBriefPrimitives';

//  THIS IS A CUSTOM COMPONENT THAT ONLY WORKS FOR PAYROLL PROPOSALS

const DelegateTransfer = ({ proposal = {}, minionAction }) => {
  const nomineeUI = (
    <Flex alignItems='center'>
      <AddressAvatar addr={minionAction?.nominee} hideCopy sizeForPropCard />
      <Box ml='1'>as delegate</Box>
    </Flex>
  );
  const proposerUI = (
    <Flex alignItems='center'>
      <AddressAvatar addr={minionAction?.proposer} hideCopy sizeForPropCard />
      <Box ml='1'>nominates</Box>
    </Flex>
  );
  console.log(`minionAction`, minionAction);
  return (
    <>
      <Box mb='2'>
        <AsyncCardTransfer
          isLoaded={minionAction?.proposer}
          proposal={proposal}
          outgoing
          itemText={proposerUI}
        />
      </Box>
      <AsyncCardTransfer
        isLoaded={minionAction?.nominee}
        proposal={proposal}
        incoming
        itemText={nomineeUI}
      />
    </>
  );
};
export default DelegateTransfer;
