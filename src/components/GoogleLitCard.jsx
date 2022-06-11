import { Box, Flex, HStack, Link, Stack } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { getAssetType } from '../utils/litProtocol';

import ContentBox from './ContentBox';
import TextBox from './TextBox';

const GoogleLitCard = ({ googleDoc }) => {
  // https://oauth-app.litgateway.com/google/l/5e5ec2da-578c-43b5-ba76-c326526f8621
  return (
    <ContentBox
      as={Link}
      href={`https://oauth-app.litgateway.com/google/l/${googleDoc.id}`}
      w='60%'
      isExternal
    >
      <Stack spacing={4}>
        <TextBox size='lg' color='whiteAlpha.900' maxW='80%'>
          {googleDoc?.name}
        </TextBox>
        <Flex as={HStack} spacing={2} align='center'>
          <TextBox>Asset Type:</TextBox>
          <TextBox variant='value' size='sm'>
            {getAssetType(googleDoc?.assetType)}
          </TextBox>
        </Flex>
        <Flex as={HStack} spacing={2} align='center'>
          <TextBox>Role:</TextBox>
          <TextBox variant='value'>{googleDoc?.role}</TextBox>
        </Flex>
        <Flex as={HStack} spacing={2} align='center'>
          <TextBox>Date Created:</TextBox>
          <TextBox variant='value'>
            {format(new Date(googleDoc.createdAt), 'MMMM d, yyyy p')}
          </TextBox>
        </Flex>
      </Stack>
    </ContentBox>
  );
};

export default GoogleLitCard;
