import React from 'react';
import { Flex } from '@chakra-ui/react';
import { PropCardTransfer } from './proposalBriefPrimitives';
import { ParaMd } from '../components/typography';
import AddressAvatar from '../components/addressAvatar';

const GuildKickTransfer = ({ proposal = {} }) => (
  <PropCardTransfer
    customUI={
      <Flex alignItems='center'>
        <ParaMd mr='2'>GuildKick</ParaMd>
        <AddressAvatar hideCopy sizeForPropCard addr={proposal.applicant} />
      </Flex>
    }
    outgoing
  />
);

export default GuildKickTransfer;
