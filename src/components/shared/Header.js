import React, { useContext, useEffect, useState } from 'react';
import { Text, Flex, Button, Link, Spinner } from '@chakra-ui/core';
import { useLocation } from 'react-router-dom';
import { useUser, useNetwork } from '../../contexts/PokemolContext';
import { Web3SignIn } from './Web3SignIn';
import UserAvatar from './UserAvatar';

const Header = () => {
  const location = useLocation();
  const [user] = useUser();
  const [network] = useNetwork();
  const [pageTitle, setPageTitle] = useState();

  useEffect(() => {
    // move to helper
    switch (location.pathname) {
      case '/': {
        setPageTitle('Hub');
      }
    }
    // eslint-disable-next-line
  }, [location]);

  return (
    <Flex direction="row" justify="space-between" p={6}>
      <Flex direction="row" justify="flex-start">
        <Text fontSize="3xl">{pageTitle}</Text>

        {user ? (
          <Link href="https://3box.io/hub" isExternal>
            Edit Profile on 3Box
          </Link>
        ) : null}
      </Flex>

      <Flex direction="row" justify="flex-end">
        <Spinner />
        <Text fontSize="m">{network.network}</Text>

        {user ? <UserAvatar user={user} /> : <Web3SignIn />}
      </Flex>
    </Flex>
  );
};
export default Header;
