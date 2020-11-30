import React, { useEffect, useState } from 'react';
import { Box, Flex, Button } from '@chakra-ui/core';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { RiAddFill } from 'react-icons/ri';
import {
  useUser,
  useNetwork,
  useDao,
  useModals,
} from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { Web3SignIn } from './Web3SignIn';
import UserAvatar from './UserAvatar';
import AccountModal from '../Modal/AccountModal';

const Header = () => {
  const location = useLocation();
  const [user] = useUser();
  const [network] = useNetwork();
  const [dao] = useDao();
  const [theme] = useTheme();
  const [pageTitle, setPageTitle] = useState();
  const { modals, openModal } = useModals();

  useEffect(() => {
    if (location.pathname === '/') {
      setPageTitle('Hub');
    } else if (location.pathname === `/dao/${dao?.address}`) {
      setPageTitle('Overview');
    } else if (location.pathname === `/dao/${dao?.address}/proposals`) {
      setPageTitle(theme.daoMeta.proposals);
      // TODO proposals id regex
    } else if (location.pathname === `/dao/${dao?.address}/proposals`) {
      setPageTitle(theme.daoMeta.proposals);
    } else if (
      location.pathname === `/dao/${dao?.address}/proposals/new/member`
    ) {
      setPageTitle(
        'New ' + theme.daoMeta.member + ' ' + theme.daoMeta.proposal,
      );
    } else if (location.pathname === `/dao/${dao?.address}/proposals/new`) {
      setPageTitle(theme.daoMeta.proposal);
    } else if (location.pathname === `/dao/${dao?.address}/members`) {
      setPageTitle(theme.daoMeta.members);
    } else if (location.pathname === `/dao/${dao?.address}/bank`) {
      setPageTitle(theme.daoMeta.bank);
    } else if (location.pathname === `/dao/${dao?.address}/settings`) {
      setPageTitle('Settings');
    } else if (location.pathname === `/dao/${dao?.address}/settings/boosts`) {
      setPageTitle(theme.daoMeta.boosts);
    } else if (
      location.pathname === `/dao/${dao?.address}/settings/boosts/new`
    ) {
      setPageTitle('New ' + theme.daoMeta.boost);
    } else if (
      location.pathname === `/themeSample` ||
      location.pathname === `/theme`
    ) {
      setPageTitle('Theme Samples');
    } else if (
      location.pathname === `/dao/${dao?.address}/profile/${user?.username}`
    ) {
      setPageTitle(`${theme.daoMeta.member} Profile`);
    } else {
      // TODO pull from graph data
      setPageTitle(dao?.apiMeta?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, dao, theme.daoMeta, setPageTitle]);

  return (
    <>
      <Flex direction='row' justify='space-between' p={6}>
        <Flex direction='row' justify='flex-start' align='center'>
          <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mr={10}>
            {pageTitle}
          </Box>
          {location.pathname === `/` && user && (
            <Button as='a' href='https://3box.io/hub' target='_blank'>
              Edit 3Box Profile
            </Button>
          )}
          {location.pathname === `/dao/${dao?.address}/proposals` && (
            <Button
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new`}
              rightIcon={<RiAddFill />}
            >
              New {theme.daoMeta.proposal}
            </Button>
          )}
          {location.pathname === `/dao/${dao?.address}/members` && (
            <Button
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new/member`}
            >
              Apply
            </Button>
          )}
          {location.pathname === `/dao/${dao?.address}/bank` && (
            <Button
              as={RouterLink}
              to={`/dao/${dao?.address}/bank/token/new`}
              rightIcon={<RiAddFill />}
            >
              Add Asset
            </Button>
          )}
          {(location.pathname === `/dao/${dao?.address}/settings` ||
            location.pathname === `/dao/${dao?.address}/settings/boosts`) &&
            // <Button
            //   as={RouterLink}
            //   to={`/dao/${dao?.address}/settings/boosts/new`}
            //   rightIcon={<RiAddFill />}
            // >
            //   Add {theme.daoMeta.boost}
            // </Button>
            null}
        </Flex>

        <Flex direction='row' justify='flex-end' align='center'>
          <Box fontSize='md' mr={5} as='i' fontWeight={200}>
            {network.network}
          </Box>

          {user ? (
            <>
              <Button
                variant='outline'
                onClick={() => openModal('accountModal')}
              >
                <UserAvatar user={user.profile ? user.profile : user} />
              </Button>

              <AccountModal isOpen={modals.accountModal} />
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
