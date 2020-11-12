import React from 'react';
import { Flex, Box } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';

import ProfileActivityFeed from '../../components/Profile/ProfileActivityFeed';

const Profile = () => {
  const params = useParams();
  return (
    <Flex>
      <Box w='70%'>
        <p>some things</p>
      </Box>
      <Box w='28%'>
        <ProfileActivityFeed profileAddress={params.id} />
      </Box>
    </Flex>
  );
};

export default Profile;
