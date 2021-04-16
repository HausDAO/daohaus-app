import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Icon, Image, Box, useToast } from '@chakra-ui/react';
import { RiLoginBoxLine } from 'react-icons/ri';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { UBERHAUS_DATA } from '../utils/uberhaus';
import DAOHaus from '../assets/img/Daohaus__Castle--Dark.svg';

const UberHausAvatar = ({ enableCopy = true, enableLink = true }) => {
  const toast = useToast();

  const copiedToast = () => {
    toast({
      title: 'Copied Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex alignItems='center'>
      <Image src={DAOHaus} w='40px' h='40px' mr={4} />
      <Box fontFamily='heading' fontSize='sm' fontWeight={900} mr={4}>
        UberHAUS
      </Box>
      <Flex alignItems='center' transform='translateY(-3px)'>
        {enableCopy && (
          <CopyToClipboard
            text={UBERHAUS_DATA.ADDRESS}
            mr={2}
            onCopy={copiedToast}
          >
            <Icon
              transform='translateY(2px)'
              as={FaCopy}
              color='secondary.300'
              mr={3}
              _hover={{ cursor: 'pointer' }}
            />
          </CopyToClipboard>
        )}
        {enableLink && (
          <RouterLink
            to={`/dao/${UBERHAUS_DATA.NETWORK}/${UBERHAUS_DATA.ADDRESS}`}
          >
            <Icon as={RiLoginBoxLine} color='secondary.500' h='20px' w='20px' />
          </RouterLink>
        )}
      </Flex>
    </Flex>
  );
};

export default UberHausAvatar;
