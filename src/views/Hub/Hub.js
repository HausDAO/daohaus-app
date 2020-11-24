import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/core';

import { useUser } from '../../contexts/PokemolContext';
import GraphFetch from '../../components/Shared/GraphFetch';
import MemberDaoList from '../../components/Hub/MemberDaoList';
import HubSignedOut from '../../components/Hub/HubSignedOut';
import HubProfileCard from '../../components/Hub/HubProfileCard';
import HubActivityFeed from '../../components/Hub/HubActivityFeed';
import TextBox from '../../components/Shared/TextBox';
import ContentBox from '../../components/Shared/ContentBox';
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
              <ContentBox p={6} mt={6} maxW='600px'>
                {memberDaos ? (
                  <>
                    <MemberDaoList
                      daos={memberDaos.map((member) => member.moloch)}
                    />
                  </>
                ) : null}
              </ContentBox>
            </Box>

            <Box pl={8}>
              <Box
                fontSize='md'
                fontFamily='heading'
                textTransform='uppercase'
                fontWeight={700}
              >
                Recent Activity
              </Box>
              {memberDaos && memberDaos.length > 0 ? (
                <HubActivityFeed
                  daos={memberDaos.map((member) => member.moloch)}
                />
              ) : (
                <TextBox my={35}>
                  Recent Activity from your daos will show here
                </TextBox>
              )}
            </Box>
          </Flex>

          <GraphFetch
            query={HUB_MEMBERSHIPS}
            setRecords={setMemberDaos}
            entity='membersHub'
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
