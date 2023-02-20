import React from 'react';
// import { Box, Text, Link, Icon } from '@chakra-ui/react';
import { Box, Text } from '@chakra-ui/react';
// import { RiExternalLinkLine } from 'react-icons/ri';

const NoticeBanner = () => {
  return (
    <Box w='100%' backgroundColor='red.500' p='20px' textAlign='center'>
      <Text fontSize='xl' fontWeight='700' fontStyle='mono'>
        👹 MOLOCH V3 IS RISING 👹
      </Text>
      <Text fontSize='md'>
        Look for us at ETHDenver 2023
        {/* <Link
          color='white'
          href='https://blog.ethereum.org/2022/06/21/testnet-deprecation'
          isExternal
        >
          See deprecation announcement here.
          <Icon as={RiExternalLinkLine} ml='2px' mt='-3px' />
        </Link> */}
      </Text>
    </Box>
  );
};

export default NoticeBanner;
