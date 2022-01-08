import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

import AddressAvatar from '../components/addressAvatar';
import { AsyncCardTransfer } from './propBriefPrimitives';

//  THIS IS A CUSTOM COMPONENT THAT ONLY WORKS FOR  UBERHAUS DELEGATE PROPOSALS

const StakeTransfer = ({ proposal = {}, minionAction }) => {
  console.log(`proposal`, proposal);
  console.log(`minionAction`, minionAction);
  // const nomineeUI = (
  //   <Flex alignItems='center'>
  //     <AddressAvatar addr={minionAction?.nominee} hideCopy sizeForPropCard />
  //     <Box ml='1'>as delegate</Box>
  //   </Flex>
  // );
  // const proposerUI = (
  //   <Flex alignItems='center'>
  //     <AddressAvatar addr={minionAction?.proposer} hideCopy sizeForPropCard />
  //     <Box ml='1'>is nominating</Box>
  //   </Flex>
  // );

  return (
    <>
      <Box mb='2'>
        <AsyncCardTransfer
          isLoaded={minionAction?.proposer}
          proposal={proposal}
          outgoing
          // action={proposerUI}
        />
      </Box>
      <AsyncCardTransfer
        isLoaded={minionAction?.nominee}
        proposal={proposal}
        incoming
        // action={nomineeUI}
      />
    </>
  );
};
export default StakeTransfer;
