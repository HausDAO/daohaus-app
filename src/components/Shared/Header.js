import React, { useEffect, useState } from 'react';
import { Text, Flex, Icon, Button } from '@chakra-ui/core';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { RiAddFill } from 'react-icons/ri';
import {
  useUser,
  useNetwork,
  useDao,
  useTheme,
} from '../../contexts/PokemolContext';
import { Web3SignIn } from './Web3SignIn';
import UserAvatar from './UserAvatar';
import { PrimaryButton } from '../../themes/theme';
import DaoSwitcherModal from '../Modal/DaoSwitcherModal';

const Header = () => {
  const location = useLocation();
  const [user] = useUser();
  const [network] = useNetwork();
  const [dao] = useDao();
  const [theme] = useTheme();
  const [pageTitle, setPageTitle] = useState();
  const [showDaoSwitcher, setShowDaoSwitcher] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setPageTitle('Hub');
    } else if (location.pathname === `/dao/${dao?.address}`) {
      setPageTitle('Overview');
    } else if (location.pathname === `/dao/${dao?.address}/proposals`) {
      setPageTitle(theme.daoMeta.proposals);
    } else if (
      location.pathname === `/dao/${dao?.address}/proposals/new/member`
    ) {
      setPageTitle(
        'New ' + theme.daoMeta.member + ' ' + theme.daoMeta.proposal,
      );
    } else if (location.pathname === `/dao/${dao?.address}/proposals/new`) {
      setPageTitle('New ' + theme.daoMeta.proposal);
    } else if (location.pathname === `/dao/${dao?.address}/members`) {
      setPageTitle(theme.daoMeta.members);
    } else if (location.pathname === `/dao/${dao?.address}/bank`) {
      setPageTitle(theme.daoMeta.bank);
    } else {
      // TODO pull from graph data
      setPageTitle(dao?.apiMeta?.name);
    }
  }, [location, dao, theme.daoMeta, setPageTitle]);

  return (
    <>
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
            <PrimaryButton
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new`}
            >
              New {theme.daoMeta.proposal} <Icon as={RiAddFill} />
            </PrimaryButton>
          )}
          {location.pathname === `/dao/${dao?.address}/members` && (
            <PrimaryButton
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new/member`}
            >
              Apply
            </PrimaryButton>
          )}
        </Flex>

        <Flex direction='row' justify='flex-end' align='center'>
          <Text fontSize='md' mr={5} as='i' fontWeight={200}>
            {network.network}
          </Text>

          {user ? (
            <>
              <Button
                variant='outline'
                onClick={() => setShowDaoSwitcher(true)}
              >
                <UserAvatar user={user.profile ? user.profile : user} />
              </Button>

              <DaoSwitcherModal
                isOpen={showDaoSwitcher}
                setShowModal={setShowDaoSwitcher}
              />
            </>
          ) : (
            <Web3SignIn />
          )}
        </Flex>
      </Flex>
    </>
  );
};
export default Header;
