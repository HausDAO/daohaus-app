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
      <Box mr='1'>Nominating</Box>{' '}
      <Flex>
        <AddressAvatar addr={minionAction?.nominee} hideCopy />
      </Flex>
    </Flex>
  );
  return (
    <>
      <AsyncCardTransfer
        isLoaded={minionAction?.nominee}
        proposal={proposal}
        incoming
        itemText={nomineeUI}
      />
      <AsyncCardTransfer
        isLoaded={minionAction?.nominee}
        proposal={proposal}
        outgoing
        itemText={minionAction?.nominee}
      />
    </>
  );
};
export default DelegateTransfer;
