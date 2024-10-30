import React from 'react';
import { Flex } from '@chakra-ui/react';

import { PropCardTransfer } from './proposalBriefPrimitives';
import { ParaMd } from '../components/typography';
import MediaBox from '../components/mediaBox';

const MinionTributeTransfer = ({ proposal = {} }) => {
  return (
    <Flex justify='space-between' alignItems='flex-start'>
      <PropCardTransfer
        customUI={
          <Flex alignItems='center'>
            <ParaMd mr='2'>For 1 NFT</ParaMd>
          </Flex>
        }
        incoming
      />

      {proposal?.link && <MediaBox link={proposal.link} width='10%' />}
    </Flex>
  );
};

export default MinionTributeTransfer;
