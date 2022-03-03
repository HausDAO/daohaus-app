import React from 'react';
import { Flex } from '@chakra-ui/react';

import { PropCardTransfer } from './proposalBriefPrimitives';
import { ParaMd } from '../components/typography';
import MediaBox from '../components/mediaBox';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';

const RaribleTransferSell = ({ proposal = {} }) => {
  return (
    <Flex justify='space-between' alignItems='flex-start'>
      {proposal.proposalType === PROPOSAL_TYPES.SELL_NFT_RARIBLE && (
        <PropCardTransfer
          customUI={
            <Flex alignItems='center'>
              <ParaMd mr='2'>Offering 1 NFT on Rarible</ParaMd>
            </Flex>
          }
          outgoing
        />
      )}

      {proposal.proposalType === PROPOSAL_TYPES.BUY_NFT_RARIBLE && (
        <PropCardTransfer
          customUI={
            <Flex alignItems='center'>
              <ParaMd mr='2'>To Buy 1 NFT on Rarible</ParaMd>
            </Flex>
          }
          incoming
        />
      )}

      {proposal?.link && <MediaBox link={proposal.link} width='10%' />}
    </Flex>
  );
};

export default RaribleTransferSell;
