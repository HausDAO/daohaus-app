import React, { useState, useEffect } from 'react';
import { Flex, Box, Image } from '@chakra-ui/react';

import makeBlockie from 'ethereum-blockies-base64';
import { truncateAddr } from '../utils/general';
import { handleGetProfile } from '../utils/3box';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const HubProfileCard = () => {
  const { address } = useInjectedProvider();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await handleGetProfile(address);
        if (data.status === 'error') {
          return;
        }
        setProfile(data);
      } catch (error) {
        console.log("MemberDoesn't have a profile");
      }
    };
    getProfile();
  }, [address]);

  return (
    <>
      {address && (
        <Flex direction='row' alignItems='center' pt={2}>
          {profile?.image[0] ? (
            <Image
              w='100px'
              h='100px'
              mr={6}
              rounded='full'
              src={`https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`}
            />
          ) : (
            <Image
              w='100px'
              h='100px'
              mr={6}
              rounded='full'
              src={makeBlockie(address)}
            />
          )}
          <Flex direction='column'>
            <Box fontSize='xl' fontFamily='heading'>
              {profile?.name || truncateAddr(address)}
              <span>{profile?.emoji || ''} </span>
            </Box>
            {profile?.name ? (
              <Box fontSize='sm' fontFamily='mono'>
                {truncateAddr(address)}
              </Box>
            ) : null}
          </Flex>
        </Flex>
      )}
      <Box fontSize='sm' mt={4} fontFamily='mono'>
        {profile?.description}
      </Box>
    </>
  );
};

export default HubProfileCard;
