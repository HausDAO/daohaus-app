import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Icon } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';

import { useDao, useMemberWallet } from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';

const Superpowers = () => {
  const [dao] = useDao();
  const [memberWallet] = useMemberWallet();

  return (
    <ContentBox
      d='flex'
      flexDirection='column'
      position='relative'
      mt={2}
      mb={6}
    >
      {dao?.boosts?.customTheme?.active ? (
        <Flex p={4} justify='space-between' align='center'>
          <TextBox size='md' colorScheme='whiteAlpha.900'>
            Custom Theme
          </TextBox>
          <Flex align='center'>
            {memberWallet?.shares > 0 ? (
              <RouterLink to={`/dao/${dao.address}/settings/theme`}>
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

      {dao?.boosts?.notificationsLevel1?.active ? (
        <Flex p={4} justify='space-between' align='center'>
          <TextBox size='md' colorScheme='whiteAlpha.900'>
            Notifications
          </TextBox>
          <Flex align='center'>
            {memberWallet?.shares > 0 ? (
              <RouterLink to={`/dao/${dao.address}/settings/notifications`}>
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
    </ContentBox>
  );
};

export default Superpowers;
