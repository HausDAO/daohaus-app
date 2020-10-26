import React, { useContext, useEffect, useState } from 'react';
import { Text, Flex, Link, Spinner } from '@chakra-ui/core';
import { useLocation } from 'react-router-dom';
import { PokemolContext } from '../../contexts/PokemolContext';
import { Web3SignIn } from './Web3SignIn';
import UserAvatar from './UserAvatar';

const Header = () => {
  const location = useLocation();
  const { state } = useContext(PokemolContext);
  const [pageTitle, setPageTitle] = useState();

  useEffect(() => {
    if (location.pathname === '/') {
      setPageTitle('Hub');
    } else {
      // TODO pull from graph data
      setPageTitle(state.dao?.apiMeta.name);
    }
    // eslint-disable-next-line
  }, [location, state.dao]);

  return (
    <Flex direction="row" justify="space-between" p={6}>
      <Flex direction="row" justify="flex-start">
        <Text fontSize="3xl">{pageTitle}</Text>

        {state.user ? (
          <Link href="https://3box.io/hub" isExternal>
            Edit Profile on 3Box
          </Link>
        ) : null}
      </Flex>

      <Flex direction="row" justify="flex-end">
        <Spinner />
        <Text fontSize="m">{state.network.network}</Text>

        {state.user ? <UserAvatar user={state.user} /> : <Web3SignIn />}
      </Flex>
    </Flex>
  );
};
export default Header;
