import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { getCopy } from '../utils/metadata';

const Header = ({ dao, daoMetaData }) => {
  const location = useLocation();
  const { injectedChain } = useInjectedProvider();

  const getHeading = () => {
    switch (location.pathname) {
      case '/':
        return 'Hub';
      case '/explore':
        return 'Explore DAOs';
      case '/summon':
        return 'Summon';
      case `/dao/${dao.chainID}/${dao.daoID}`:
        return getCopy(daoMetaData, 'name');
      case `/dao/${dao.chainID}/${dao.daoID}/proposals`:
        return getCopy(daoMetaData, 'proposals');
      case `/dao/${dao.chainID}/${dao.daoID}/bank`:
        return getCopy(daoMetaData, 'bank');
      case `/dao/${dao.chainID}/${dao.daoID}/members`:
        return getCopy(daoMetaData, 'members');
      case `/dao/${dao.chainID}/${dao.daoID}/boosts`:
        return 'Boosts';
      case `/dao/${dao.chainID}/${dao.daoID}/settings`:
        return 'Settings';
    }
  };

  // const getTitle = () => {
  //   if (location.pathname === "/") {
  //     setPageTitle("Hub");
  //   } else if (location.pathname === `/explore`) {
  //     setPageTitle("Explore DAOs");
  //   } else if (location.pathname === `/dao/${dao?.address}`) {
  //     setPageTitle("Overview");
  //   } else if (location.pathname === `/dao/${dao?.address}/proposals`) {
  //     setPageTitle(theme.daoMeta.proposals);
  //     // TODO proposals id regex
  //   } else if (location.pathname === `/dao/${dao?.address}/proposals`) {
  //     setPageTitle(theme.daoMeta.proposals);
  //   } else if (
  //     location.pathname === `/dao/${dao?.address}/proposals/new/member`
  //   ) {
  //     setPageTitle(
  //       "New " + theme.daoMeta.member + " " + theme.daoMeta.proposal
  //     );
  //   } else if (location.pathname === `/dao/${dao?.address}/proposals/new`) {
  //     setPageTitle(`New ${theme.daoMeta.proposal}`);
  //   } else if (location.pathname === `/dao/${dao?.address}/members`) {
  //     setPageTitle(theme.daoMeta.members);
  //   } else if (location.pathname === `/dao/${dao?.address}/bank`) {
  //     setPageTitle(theme.daoMeta.bank);
  //   } else if (location.pathname === `/dao/${dao?.address}/settings`) {
  //     setPageTitle("Settings");
  //   } else if (location.pathname === `/dao/${dao?.address}/settings/meta`) {
  //     setPageTitle("Metadata");
  //   } else if (location.pathname === `/dao/${dao?.address}/settings/theme`) {
  //     setPageTitle("Theme");
  //   } else if (
  //     location.pathname === `/dao/${dao?.address}/settings/notifications`
  //   ) {
  //     setPageTitle("Notifications");
  //   } else if (location.pathname === `/dao/${dao?.address}/settings/boosts`) {
  //     setPageTitle(theme.daoMeta.boosts);
  //   } else if (
  //     location.pathname === `/dao/${dao?.address}/settings/boosts/new`
  //   ) {
  //     setPageTitle("New " + theme.daoMeta.boost);
  //   } else if (
  //     location.pathname === `/themeSample` ||
  //     location.pathname === `/theme`
  //   ) {
  //     setPageTitle("Theme Samples");
  //   } else if (
  //     location.pathname === `/dao/${dao?.address}/profile/${user?.username}`
  //   ) {
  //     setPageTitle(`${theme.daoMeta.member} Profile`);
  //   } else {
  //     // TODO pull from graph data
  //     setPageTitle(dao?.apiMeta?.name);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }

  return (
    <Flex direction='row' justify='space-between' p={6}>
      <Flex
        direction='row'
        justify={['space-between', null, null, 'flex-start']}
        align='center'
        w={['100%', null, null, 'auto']}
      >
        <Box
          fontSize={['lg', null, null, '3xl']}
          color='#ffffff'
          fontFamily='heading'
          fontWeight={700}
          mr={10}
        >
          {getHeading()}
        </Box>
        {/* {location.pathname === `/` && user && (
            <Button as="a" href="https://3box.io/hub" target="_blank">
              Edit 3Box Profile
            </Button>
          )}
          {location.pathname === `/dao/${dao?.address}/proposals` && user && (
            <Button
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new`}
              rightIcon={<RiAddFill />}
            >
              New {theme.daoMeta.proposal}
            </Button>
          )}
          {location.pathname === `/dao/${dao?.address}/members` && user && (
            <>
              {memberWallet && !memberWallet.activeMember ? (
                <Button
                  as={RouterLink}
                  to={`/dao/${dao?.address}/proposals/new/member`}
                >
                  Apply
                </Button>
              ) : null}
            </>
          )}
          {location.pathname === `/dao/${dao?.address}/bank` && user && (
            <Button
              as={RouterLink}
              to={`/dao/${dao?.address}/proposals/new/whitelist`}
              rightIcon={<RiAddFill />}
            >
              Add Asset
            </Button>
          )} */}
      </Flex>

      <Flex
        direction='row'
        justify='flex-end'
        align='center'
        d={['none', null, null, 'flex']}
      >
        <Box fontSize='md' mr={5} as='i' fontWeight={200}>
          {injectedChain?.name}
        </Box>
        {/* <ChainDisplay /> */}

        {/* {user ? (
          <>
            <Button variant="outline" onClick={() => openModal("accountModal")}>
              <UserAvatar
                user={
                  Object.keys(user.profile).length === 0 ? user : user.profile
                }
                hideCopy={true}
              />
            </Button>

            <AccountModal isOpen={modals.accountModal} />
          </>
        ) : (
          <Web3SignIn />
        )} */}
      </Flex>
    </Flex>
  );
};
export default Header;
