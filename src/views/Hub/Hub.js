import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/core';

import { useUser } from '../../contexts/PokemolContext';
import GraphFetch from '../../components/Shared/GraphFetch';
import MemberDaoList from '../../components/Hub/MemberDaoList';
import HubSignedOut from '../../components/Hub/HubSignedOut';
import HubProfileCard from '../../components/Hub/HubProfileCard';
import HubActivityFeed from '../../components/Hub/HubActivityFeed';
import { HUB_MEMBERSHIPS } from '../../utils/apollo/member-queries';

const Hub = () => {
  const [user] = useUser();
  const [memberDaos, setMemberDaos] = useState();

  return (
    <Box p={6}>
      {user ? (
        <>
          <Flex>
            <Box w='50%'>
              <HubProfileCard />
              <Box
                rounded='lg'
                bg='blackAlpha.600'
                borderWidth='1px'
                borderColor='whiteAlpha.200'
                p={6}
                mt={6}
                maxW='600px'
              >
                {memberDaos ? (
                  <MemberDaoList
                    daos={memberDaos.map((member) => member.moloch)}
                  />
                ) : null}
              </Box>
            </Box>

            <Box>
              <Box
                fontSize='md'
                fontFamily='heading'
                textTransform='uppercase'
                fontWeight={700}
                ml={8}
              >
                Recent Activity
              </Box>
              {memberDaos ? (
                <HubActivityFeed
                  daos={memberDaos.map((member) => member.moloch)}
                />
              ) : null}
            </Box>
          </Flex>

          <GraphFetch
            query={HUB_MEMBERSHIPS}
            setRecords={setMemberDaos}
            entity='members'
            variables={{ memberAddress: user.username }}
          />
        </>
      ) : (
        <HubSignedOut />
      )}
    </Box>
  );
};

export default Hub;
