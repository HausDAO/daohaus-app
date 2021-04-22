import React from 'react';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { RiLoginBoxLine } from 'react-icons/ri';

const DaoToDaoUberAlly = ({ dao }) => {
  return (
    <>
      {dao.bodyText && <Box fontSize='sm'>{dao.bodyText}</Box>}
      <Flex align='center' justifyContent='space-between'>
        <Box fontSize='lg' fontFamily='heading' fontWeight={700} pb={2}>
          {dao.name}
        </Box>
        <RouterLink to={dao.link}>
          <Icon as={RiLoginBoxLine} color='secondary.500' h='25px' w='25px' />
        </RouterLink>
      </Flex>
    </>
  );
};

export default DaoToDaoUberAlly;
