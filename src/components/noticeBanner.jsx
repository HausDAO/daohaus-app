import React from 'react';
import { Box, Text, Link, Icon, Flex } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

const NoticeBanner = () => {
  return (
    <Box w='100%' backgroundColor='red.500' p='20px' textAlign='center'>
      <Text fontSize='xl' fontWeight='700' fontStyle='mono'>
        👹 MOLOCH V3 RISES 👹
      </Text>
      <Link color='white' href='https://daohaus.club/' isExternal>
        <Text fontSize='md'>
          Learn more
          <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
        </Text>
      </Link>
    </Box>
  );
};

export default NoticeBanner;
