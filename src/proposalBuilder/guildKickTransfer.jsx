import React from 'react';
import { Flex } from '@chakra-ui/react';
import { PropCardTransfer } from './propBriefPrimitives';
import { ParaMd } from '../components/typography';
import AddressAvatar from '../components/addressAvatar';

//  THIS IS A CUSTOM COMPONENT THAT ONLY WORKS FOR GUILDKICK PROPOSALS

const GuildKickTransfer = ({ proposal = {} }) => {
  const customUI = (
    <Flex alignItems='center'>
      <ParaMd mr='2'>GuildKick</ParaMd>
      <AddressAvatar hideCopy sizeForPropCard addr={proposal.applicant} />
    </Flex>
  );

  return (
    <PropCardTransfer
      action='GuildKick'
      proposal={proposal}
      customUI={customUI}
      outgoing
    />
  );
};
export default GuildKickTransfer;
