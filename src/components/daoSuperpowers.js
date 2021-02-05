import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Flex, Icon, Link } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';

import { useDaoMember } from '../contexts/DaoMemberContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { useMetaData } from '../contexts/MetaDataContext';

const Superpowers = () => {
  const { daochain, daoid } = useParams();
  const { daoMember } = useDaoMember();
  const { daoMetaData } = useMetaData();

  return (
    <ContentBox
      d='flex'
      flexDirection='column'
      position='relative'
      mt={2}
      mb={6}
    >
      {daoMetaData?.boosts?.customTheme?.active ? (
        <Flex p={4} justify='space-between' align='center'>
          <TextBox size='md' colorScheme='whiteAlpha.900'>
            Custom Theme
          </TextBox>
          <Flex align='center'>
            {daoMember?.shares > 0 ? (
              <RouterLink to={`/dao/${daochain}/${daoid}/settings/theme`}>
                <Icon
                  as={VscGear}
                  color='secondary.500'
                  w='25px'
                  h='25px'
                  mr={3}
                />
              </RouterLink>
            ) : (
              <TextBox colorScheme='whiteAlpha.900' size='xs'>
                Only Active Members can change the theme.
              </TextBox>
            )}
          </Flex>
        </Flex>
      ) : null}

      {daoMetaData?.boosts?.notificationsLevel1?.active ? (
        <Flex p={4} justify='space-between' align='center'>
          <TextBox size='md' colorScheme='whiteAlpha.900'>
            Notifications
          </TextBox>
          <Flex align='center'>
            {daoMember?.shares > 0 ? (
              <RouterLink
                to={`/dao/${daochain}/${daoid}/settings/notifications`}
              >
                <Icon
                  as={VscGear}
                  color='secondary.500'
                  w='25px'
                  h='25px'
                  mr={3}
                />
              </RouterLink>
            ) : (
              <TextBox colorScheme='whiteAlpha.900' size='xs'>
                Only Active Members can change manage this.
              </TextBox>
            )}
          </Flex>
        </Flex>
      ) : null}

      {daoMetaData?.boosts?.discourse?.active ? (
        <Flex p={4} justify='space-between' align='center'>
          <TextBox size='md' colorScheme='whiteAlpha.900'>
            Discourse Forum
          </TextBox>
          <Flex align='center'>
            <Link
              href={`https://forum.daohaus.club/c/${daoMetaData.boosts.discourse.metadata.slug}/${daoMetaData.boosts.discourse.metadata.categoryId}`}
              isExternal
            >
              <Icon
                as={VscGear}
                color='secondary.500'
                w='25px'
                h='25px'
                mr={3}
              />
            </Link>
          </Flex>
        </Flex>
      ) : null}
    </ContentBox>
  );
};

export default Superpowers;
