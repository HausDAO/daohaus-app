import React from 'react';
import { Flex, Skeleton } from '@chakra-ui/react';

import { ParaSm } from '../components/typography';
import { PropActionBox, StatusDisplayBox } from './proposalActionPrimitives';
import { propStatusText } from '../data/proposalCardText';

const SkeletonActionCard = () => {
  return (
    <PropActionBox>
      <StatusDisplayBox>
        <Skeleton>
          <ParaSm>No one will ever read this!</ParaSm>
        </Skeleton>
      </StatusDisplayBox>
      <Skeleton mb={4}>
        <ParaSm>{propStatusText.Unsponsored}</ParaSm>
      </Skeleton>
      <Skeleton>
        <Flex height='1.5rem' width='4rem' />
      </Skeleton>
    </PropActionBox>
  );
};

export default SkeletonActionCard;
