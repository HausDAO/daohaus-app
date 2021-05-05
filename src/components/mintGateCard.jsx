import React from 'react';
import { Link, Flex, Image, HStack, Box, Tooltip } from '@chakra-ui/react';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

const MintGateCard = ({ gate }) => (
  <ContentBox
    as={Link}
    href={gate.link}
    w='25%'
    _hover={{
      color: 'whiteAlpha.800',
    }}
    isExternal
  >
    <Flex direction='column' justify='space-between' align='center' h='100%'>
      <Image src={gate.img} maxW='250px' />
      <Flex m='10px 5%' direction='column'>
        <TextBox size='lg' textAlign='center'>
          {gate.title}
        </TextBox>
        <TextBox size='xs' variant='value'>
          {gate?.desc?.length > 100
            ? `${gate?.desc?.slice(0, 100)}...`
            : gate.desc}
        </TextBox>
      </Flex>
      <Flex justify='space-between' w='100%'>
        <Flex as={HStack} align='center' spacing={3}>
          <Image src={gate.photo} maxW='35px' borderRadius='20px' />
          <TextBox size='xs'>{gate.username}</TextBox>
        </Flex>
        <Tooltip
          label='Shares required to unlock this gate'
          aria-label={`gate requires ${gate?.tokens[0]?.minbal} dao shares to unlock`}
          placement='top-end'
          hasArrow
        >
          <Box
            bg='secondary.500'
            padding='0.5rem 1rem'
            borderRadius='20px'
            display='inline-flex'
          >
            {gate?.tokens[0]?.minbal}
          </Box>
        </Tooltip>
      </Flex>
    </Flex>
  </ContentBox>
);

export default MintGateCard;
