import React, { useEffect, useState } from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';

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
  const [v2Daos, setV2Daos] = useState([]);

  useEffect(() => {
    if (memberDaos) {
      // TODO: Remove when v2 is ready
      setV2Daos(
        memberDaos
          .filter((member) => member.moloch.version === '2')
          .map((member) => member.moloch),
      );
    }
  }, [memberDaos]);

  return (
    <Box p={6}>
      {user ? (
        <>
          <Flex>
            <Box w='50%'>
              <HubProfileCard />
              {memberDaos && memberDaos.length > 0 ? (
                <ContentBox p={6} mt={6} maxW='600px'>
                  {v2Daos.length > 0 ? (
                    <>
                      <MemberDaoList daos={v2Daos} />
                    </>
                  ) : null}
                </ContentBox>
              ) : (
                <ContentBox p={6} mt={6} maxW='600px'>
                  <Flex>
                    <TextBox>You aren’t a member in any daos yet!</TextBox>
                  </Flex>

                  <Flex align='center'>
                    <Box
                      w='60px'
                      h='60px'
                      border='1px dashed rgba(255, 255, 255, 0.2);'
                      borderRadius='40px'
                      my={10}
                    />
                    <TextBox ml='15px'>Your daos will show here</TextBox>
                  </Flex>

                  <Link
                    href='https://daohaus.club'
                    isExternal
                    fontSize='md'
                    textTransform='uppercase'
                  >
                    Explore more DAOs
                  </Link>
                </ContentBox>
              )}
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
              {v2Daos.length > 0 ? (
                <HubActivityFeed daos={v2Daos} />
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
