import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Link } from '@chakra-ui/react';

const DaosquareHeader = () => {
  return (
    <Flex direction='row' justify='space-between' w='100%' px={6} py={2}>
      <Link
        as={RouterLink}
        color='mode.900'
        to='/daosquare-incubator'
        fontWeight='700'
        pr={6}
      >
        CCOs
      </Link>
      <Link
        href='https://www.daosquare.io/'
        isExternal
        color='mode.900'
        fontWeight='700'
        pr={6}
      >
        About
      </Link>
      <Link
        href='https://www.daosquare.io/'
        isExternal
        color='mode.900'
        fontWeight='700'
        pr={6}
      >
        Apply
      </Link>
    </Flex>
  );
};
export default DaosquareHeader;
