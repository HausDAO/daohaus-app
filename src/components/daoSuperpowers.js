import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Flex, Icon, Switch } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';

import { useDaoMember } from '../contexts/DaoMemberContext';
// import { useMetaData } from '../contexts/MetaDataContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import ComingSoonOverlay from './comingSoonOverlay';

const Superpowers = () => {
  const { daochain, daoid } = useParams();
  const { daoMember } = useDaoMember();
  // const { apiMetaData } = useMetaData();
  const [customTheme] = useState(true);
  // console.log(apiMetaData);

  return (
    <ContentBox
      d='flex'
      flexDirection='column'
      position='relative'
      mt={2}
      mb={6}
    >
      {customTheme ? (
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
      ) : (
        <>
          <Flex
            p={4}
            justify='space-between'
            align='center'
            borderBottomWidth='1px'
            borderBottomStyle='solid'
            borderBottomColor='whiteAlpha.200'
          >
            <ComingSoonOverlay />
            <TextBox colorScheme='whiteAlpha.900' size='sm'>
              Force Proposal on Save
            </TextBox>
            <Switch id='proposal-on-save' colorScheme='green' />
          </Flex>
          <Flex p={4} justify='space-between' align='center'>
            <TextBox size='md' colorScheme='whiteAlpha.900'>
              Theme
            </TextBox>
            <Flex align='center'>
              <RouterLink to={`/dao/${daochain}/${daoid}/settings/theme`}>
                <Icon
                  as={VscGear}
                  color='secondary.500'
                  w='25px'
                  h='25px'
                  mr={3}
                />
              </RouterLink>
              <Switch id='theme-boost' colorScheme='green' />
            </Flex>
          </Flex>
          <Flex p={4} justify='space-between' align='center'>
            <TextBox size='md' colorScheme='whiteAlpha.900'>
              Notifications
            </TextBox>
            <Flex align='center'>
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
              <Switch id='notification-boost' colorScheme='green' />
            </Flex>
          </Flex>
        </>
      )}
    </ContentBox>
  );
};

export default Superpowers;
