import React, { useEffect, useState } from 'react';
import { Text, Flex, Icon, Spinner } from '@chakra-ui/core';
import { useLocation } from 'react-router-dom';
import {
  useUser,
  useNetwork,
  useDao,
  useLoading,
  useTheme,
} from '../../contexts/PokemolContext';
import { Web3SignIn } from './Web3SignIn';
import UserAvatar from './UserAvatar';
import { PrimaryButton } from '../../themes/theme';

const Header = () => {
  const location = useLocation();
  const [user] = useUser();
  const [network] = useNetwork();
  const [dao] = useDao();
  const [theme] = useTheme();
  const [loading] = useLoading();
  const [pageTitle, setPageTitle] = useState();

  useEffect(() => {
    if (location.pathname === '/') {
      setPageTitle('Hub');
    } else if (location.pathname === `/dao/${dao?.address}`) {
      setPageTitle('Overview');
    } else if (location.pathname === `/dao/${dao?.address}/proposals`) {
      setPageTitle(theme.daoMeta.proposals);
    } else if (location.pathname === `/dao/${dao?.address}/members`) {
      setPageTitle(theme.daoMeta.members);
    } else if (location.pathname === `/dao/${dao?.address}/bank`) {
      setPageTitle(theme.daoMeta.bank);
    } else {
      // TODO pull from graph data
      setPageTitle(dao?.apiMeta?.name);
    }
    // eslint-disable-next-line
  }, [location, dao]);

  return (
    <Flex direction='row' justify='space-between' p={6}>
      <Flex direction='row' justify='flex-start' align='center'>
        <Text
          fontSize='3xl'
          fontFamily={theme.fonts.heading}
          fontWeight={700}
          mr={10}
        >
          {pageTitle}
        </Text>
        {location.pathname === `/` && user && (
          <PrimaryButton as='a' href='https://3box.io/hub' target='_blank'>
            Edit 3Box Profile
          </PrimaryButton>
        )}
        {location.pathname === `/dao/${dao?.address}/proposals` && (
          <PrimaryButton>
            New {theme.daoMeta.proposal} <Icon name='small-add' />
          </PrimaryButton>
        )}
        {location.pathname === `/dao/${dao?.address}/members` && (
          <PrimaryButton>Apply</PrimaryButton>
        )}
      </Flex>

      <Flex direction='row' justify='flex-end' align='center'>
        {loading && <Spinner mr={5} />}
        <Text fontSize='md' mr={5} as='i' fontWeight={200}>
          {network.network}
        </Text>

        {user ? <UserAvatar user={user} /> : <Web3SignIn />}
      </Flex>
    </Flex>
  );
};
export default Header;
