import React, { useState } from 'react';
import { Button, Box, Flex, Text, Grid } from '@chakra-ui/core';

import {
  useTheme,
  useUser,
  useClearTheme,
} from '../../contexts/PokemolContext';
import BrandOverride from '../../assets/themes/raidTheme/raidguild__avatar--pink.jpg';
import { HUB_MEMBERSHIPS } from '../../utils/apollo/hub-queries';
import GraphFetch from '../../components/shared/GraphFetch';
import MemberDaoList from '../../components/hub/MemberDaoList';
import HubSignedOut from '../../components/hub/HubSignedOut';
import HubProfileCard from '../../components/hub/HubProfileCard';

const Hub = () => {
  const [, setTheme] = useTheme();
  const [user] = useUser();
  const clearTheme = useClearTheme();
  const [memberDaos, setMemberDaos] = useState();

  const setLocalTheme = () => {
    setTheme({
      brand50: '#ff4d74',
      brand100: '#ff4d74',
      brand200: '#ff4d74',
      brand300: '#ff4d74',
      brand400: '#fe1d5b',
      brand500: '#e50651',
      brand600: '#e50651',
      brand700: '#e50651',
      brand800: '#e50651',
      brand900: '#e50651',
      brandImg: BrandOverride,
      bg400: '#000',
    });
  };

  const setDefault = () => {
    clearTheme();
  };

  return (
    <Box p={6}>
      <Flex w="100%">
        <Button onClick={setLocalTheme}> PRETEND DAO BUTTON</Button>
        <Button onClick={setDefault}> DEFAULT</Button>
      </Flex>

      {user ? (
        <>
          <Grid gap={6} templateColumns="repeat(2, 1fr)">
            <HubProfileCard />
            {/* <Box
              rounded="lg"
              bg="blackAlpha.600"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              p={6}
              mt={6}
              w="100%"
            >
              <Text fontSize="xl">Username.eth</Text>
            </Box> */}
            <Box
              rounded="lg"
              bg="blackAlpha.600"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              p={6}
              mt={6}
              w="100%"
            >
              <Text fontSize="xl">Recent Activity</Text>
            </Box>
          </Grid>

          {user && user.username ? (
            <GraphFetch
              query={HUB_MEMBERSHIPS}
              setRecords={setMemberDaos}
              entity="members"
              variables={{ memberAddress: user.username }}
            />
          ) : null}

          {memberDaos ? (
            <MemberDaoList
              daos={memberDaos.members.map((member) => member.moloch)}
            />
          ) : null}
        </>
      ) : (
        <HubSignedOut />
      )}
    </Box>
  );
};

export default Hub;
