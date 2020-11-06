import React from 'react';
import { Flex, Text, Image } from '@chakra-ui/core';

import { useUser, useTheme } from '../../contexts/PokemolContext';
import makeBlockie from 'ethereum-blockies-base64';
import EthAddressDisplay from '../Shared/EthAddressDisplay';

const HubProfileCard = () => {
  const [user] = useUser();
  const [theme] = useTheme();

  return (
    <>
      <Flex direction='row' alignItems='center' pl={12} pt={2}>
        {user.profile.image && user.profile.image[0] ? (
          <Image
            w='100px'
            h='100px'
            mr={10}
            rounded='full'
            src={`https://ipfs.infura.io/ipfs/${user.profile.image[0].contentUrl['/']}`}
          />
        ) : (
          <Image
            w='100px'
            h='100px'
            mr={10}
            rounded='full'
            src={makeBlockie(user.username)}
          />
        )}

        <Flex direction='column'>
          <Text fontSize='xl' fontFamily={theme.fonts.heading}>
            {user.profile.name || <EthAddressDisplay address={user.username} />}{' '}
            <span>{user.profile.emoji || ''} </span>
          </Text>
          {user.name ? (
            <Text fontSize='sm' fontFamily={theme.fonts.mono}>
              {<EthAddressDisplay address={user.username} />}
            </Text>
          ) : null}
        </Flex>
      </Flex>
      <Text fontSize='sm' ml={12} mt={4} fontFamily={theme.fonts.mono}>
        {user.profile.description}
      </Text>
    </>
  );
};

export default HubProfileCard;
