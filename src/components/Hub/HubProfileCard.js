import React from 'react';
import { Flex, Box, Image } from '@chakra-ui/core';

import { useUser } from '../../contexts/PokemolContext';
import makeBlockie from 'ethereum-blockies-base64';
import { truncateAddr } from '../../utils/helpers';

const HubProfileCard = () => {
  const [user] = useUser();

  return (
    <>
      <Flex direction='row' alignItems='center' pt={2}>
        {user.profile.image && user.profile.image[0] ? (
          <Image
            w='100px'
            h='100px'
            mr={6}
            rounded='full'
            src={`https://ipfs.infura.io/ipfs/${user.profile.image[0].contentUrl['/']}`}
          />
        ) : (
          <Image
            w='100px'
            h='100px'
            mr={6}
            rounded='full'
            src={makeBlockie(user.username)}
          />
        )}

        <Flex direction='column'>
          <Box fontSize='xl' fontFamily='heading'>
            {user.profile.name || truncateAddr(user.username)}{' '}
            <span>{user.profile.emoji || ''} </span>
          </Box>
          {user.name ? (
            <Box fontSize='sm' fontFamily='mono'>
              {truncateAddr(user.username)}
            </Box>
          ) : null}
        </Flex>
      </Flex>
      <Box fontSize='sm' mt={4} fontFamily='mono'>
        {user.profile.description}
      </Box>
    </>
  );
};

export default HubProfileCard;
