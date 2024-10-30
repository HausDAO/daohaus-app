import React from 'react';
import { Box, Text, Link, Icon } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

const NoticeBanner = () => {
  return (
    <Box w='100%' backgroundColor='red.600' p='20px' textAlign='center'>
      <Text fontSize='xl' fontWeight='700'>
        👹 MOLOCH III RISES 👹
      </Text>
      <Text fontSize='md' fontStyle='mono'>
        With Moloch v3 we are on a path to a decentralized future.
      </Text>
      <Link
        color='white'
        href='https://guide.daohaus.club/quickstart/migrate'
        isExternal
      >
        <Text fontSize='md'>
          Learn about how to upgrade to v3
          <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
        </Text>
      </Link>
    </Box>
  );
};

export default NoticeBanner;
