import React from 'react';
import { Box, Text, Link, Icon } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

const NoticeBanner = () => {
  return (
    <Box w='100%' backgroundColor='orange.500' p='10px' textAlign='center'>
      <Text fontSize='lg' fontWeight='700'>
        NOTICE
      </Text>
      <Text fontSize='md'>
        The DAOhaus app isn't currently able to display the most recent onchain
        data for any Gnosis Chain DAO. This is due to TheGraph subgraph errors.{' '}
        <Link
          color='white'
          href='https://status.thegraph.com/incidents/l3vzzpl87l9w'
          isExternal
        >
          Monitor the incident here
          <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
        </Link>
      </Text>
    </Box>
  );
};

export default NoticeBanner;
