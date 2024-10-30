import {
  Button,
  Center,
  Flex,
  HStack,
  Link,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getAssetType, LIT_API_HOST } from '../utils/litProtocol';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { ParaMd } from './typography';

const GoogleLitCard = ({ googleDoc, getLinkFromShare, handleDeleteShare }) => {
  return (
    <ContentBox w='60%'>
      <Stack spacing={4}>
        <TextBox size='lg' color='whiteAlpha.900' maxW='80%'>
          {googleDoc?.name}
        </TextBox>
        <Flex as={HStack} alignItems='center'>
          <Flex as={VStack} spacing={4} alignItems='start'>
            <Flex as={HStack} spacing={2} align='left'>
              <TextBox>Asset Type:</TextBox>
              <TextBox variant='value' size='sm'>
                {getAssetType(googleDoc?.assetType)}
              </TextBox>
            </Flex>
            <Flex as={HStack} spacing={2} align='left'>
              <TextBox>Role:</TextBox>
              <TextBox variant='value'>{googleDoc?.role}</TextBox>
            </Flex>
            <Flex as={HStack} spacing={2} align='left'>
              <TextBox>Date Created:</TextBox>
              <TextBox variant='value'>
                {format(new Date(googleDoc.createdAt), 'MMMM d, yyyy p')}
              </TextBox>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Center mr={10}>
            <Link to={`${LIT_API_HOST}/google/l/${googleDoc.id}`}>
              <ParaMd>VIEW</ParaMd>
            </Link>
          </Center>
          <CopyToClipboard
            text={`${LIT_API_HOST}/google/l/${googleDoc.id}`}
            onCopy={getLinkFromShare}
          >
            <Button>COPY LINK</Button>
          </CopyToClipboard>
          <Button onClick={() => handleDeleteShare(googleDoc)} ml={10}>
            <ParaMd>UNSHARE</ParaMd>
          </Button>
        </Flex>
      </Stack>
    </ContentBox>
  );
};

export default GoogleLitCard;
