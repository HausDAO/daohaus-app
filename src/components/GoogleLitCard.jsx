import { Box, Flex, HStack, Link, Stack } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { getAssetType } from '../utils/litProtocol';

import ContentBox from './ContentBox';
import TextBox from './TextBox';

// accessControlConditions: "[{\"contractAddress\":\"0x33505b8dba67eb39fd65e3270cefacbe5b9da4cd\",\"standardContractType\":\"MolochDAOv2.1\",\"chain\":\"ethereum\",\"method\":\"members\",\"parameters\":[\":userAddress\"],\"returnValueTest\":{\"comparator\":\"=\",\"value\":\"true\"}}]"
// assetIdOnService: "1wncxq6LEzvAHfGXVcOvNeHU0t-0IcE1ERSeKTApvsLo"
// assetType: "application/vnd.google-apps.spreadsheet"
// connectedServiceId: "c49459b7-b966-4f29-82b6-56bf2ff0e577"
// createdAt: new Date("2022-06-07T20:33:30.392Z")
// daoAddress: null
// id: "a6062ff0-a351-44b3-bf17-c6c7b20643cb"
// name: "ETH NYC - June 23th - June 28th"
// role: "reader"
// source: null
// updatedAt: "2022-06-07T20:33:30.392Z"
// userId: "0xb0cffe0260bf4ea7b59915fbea17273a8b9209f6"

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
