import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Icon, Switch } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';

import { useDao } from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import ComingSoonOverlay from '../Shared/ComingSoonOverlay';

const Superpowers = () => {
  const [dao] = useDao();
  return (
    <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
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
          <RouterLink to={`/dao/${dao.address}/settings/theme`}>
            <Icon as={VscGear} color='secondary.500' w='25px' h='25px' mr={3} />
          </RouterLink>
          <Switch id='theme-boost' colorScheme='green' />
        </Flex>
      </Flex>
      <Flex p={4} justify='space-between' align='center'>
        <TextBox size='md' colorScheme='whiteAlpha.900'>
          Notifications
        </TextBox>
        <Flex align='center'>
          <RouterLink to={`/dao/${dao.address}/settings/notifications`}>
            <Icon as={VscGear} color='secondary.500' w='25px' h='25px' mr={3} />
          </RouterLink>
          <Switch id='notification-boost' colorScheme='green' />
        </Flex>
      </Flex>
    </ContentBox>
  );
};

export default Superpowers;
