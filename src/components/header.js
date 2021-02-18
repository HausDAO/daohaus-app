import React from 'react';
import { useLocation, Link as RouterLink, useParams } from 'react-router-dom';
import { RiAddFill, RiInformationLine } from 'react-icons/ri';
import { Box, Flex, Button, Icon, Tooltip } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { getTerm } from '../utils/metadata';
import { useOverlay } from '../contexts/OverlayContext';
import { supportedChains } from '../utils/chain';
import { capitalize, daoConnectedAndSameChain } from '../utils/general';
import AddressAvatar from './addressAvatar';

const Header = ({ dao }) => {
  const location = useLocation();
  const params = useParams();
  const { setHubAccountModal, setDaoAccountModal } = useOverlay();
  const { injectedChain, address, requestWallet } = useInjectedProvider();

  const WrongNetworkToolTip = ({ children }) => {
    return (!address && dao) || (address && !dao) ? (
      children
    ) : daoConnectedAndSameChain(
        address,
        injectedChain?.chainID,
        dao?.chainID,
      ) ? (
      children
    ) : (
      <Tooltip
        hasArrow
        label={
          <Box fontFamily='heading'>
            Please update your network to{' '}
            {capitalize(supportedChains[dao?.chainID]?.network)} to interact
            with this DAO.
          </Box>
        }
        bg='secondary.500'
        placement='left-start'
      >
        {children}
      </Tooltip>
    );
  };

  const getHeading = () => {
    switch (location.pathname) {
      case '/':
        return 'Hub';
      case '/explore':
        return 'Explore DAOs';
      case '/summon':
        return 'Summon';
      case `/register/${params.registerchain}/${params.daoid}`:
        return 'Finish your DAO Setup';
      default:
        return "404 What's Lost Can Be Found";
    }
  };

  const getDaoHeading = () => {
    switch (location.pathname) {
      case `/register/${params.registerchain}/${params.daoid}`:
        return 'Finish your DAO Setup';
      case `/dao/${dao.chainID}/${dao.daoID}`:
        return 'Overview';
      case `/dao/${dao.chainID}/${dao.daoID}/proposals`:
        return getTerm(dao.customTerms, 'proposals');
      case `/dao/${dao.chainID}/${dao.daoID}/proposals/${params.propid}`:
        return getTerm(dao.customTerms, 'proposals');
      case `/dao/${dao.chainID}/${dao.daoID}/proposals/new/`:
        return `New ${getTerm(dao.customTerms, 'proposal')}`;
      case `/dao/${dao.chainID}/${dao.daoID}/bank`:
        return getTerm(dao.customTerms, 'bank');
      case `/dao/${dao.chainID}/${dao.daoID}/members`:
        return getTerm(dao.customTerms, 'members');
      case `/dao/${dao.chainID}/${dao.daoID}/profile/${params.userid}`:
        return 'Profile';
      case `/dao/${dao.chainID}/${dao.daoID}/settings`:
        return getTerm(dao.customTerms, 'settings');
      case `/dao/${dao.chainID}/${dao.daoID}/settings/meta`:
        return 'Metadata';
      case `/dao/${dao.chainID}/${dao.daoID}/settings/theme`:
        return 'Custom Theme';
      case `/dao/${dao.chainID}/${dao.daoID}/settings/notifications`:
        return 'Notifications';
      case `/dao/${dao.chainID}/${dao.daoID}/settings/minion/${params.minion}`:
        return 'Minions';
      case `/dao/${dao.chainID}/${dao.daoID}/settings/boosts`:
        return getTerm(dao.customTerms, 'boosts');
      case `/dao/${dao.chainID}/${dao.daoID}/settings/boosts/new`:
        return 'New ' + getTerm(dao.customTerms, 'boost');
      default:
        return "404 What's Lost Can Be Found";
    }
  };

  const getHeaderElement = () => {
    if (location.pathname === `/` && address) {
      return (
        <Button
          as='a'
          href='https://3box.io/hub'
          target='_blank'
          variant='outline'
        >
          Edit 3Box Profile
        </Button>
      );
    } else if (
      location.pathname === `/dao/${dao?.chainID}/${dao?.daoID}/proposals` &&
      daoConnectedAndSameChain(address, dao?.chainID, injectedChain?.chainID)
    ) {
      return (
        <Button
          as={RouterLink}
          to={`/dao/${dao?.chainID}/${dao?.daoID}/proposals/new`}
          rightIcon={<RiAddFill />}
        >
          New {getTerm(dao?.customTerms, 'proposal')}
        </Button>
      );
    } else if (
      location.pathname === `/dao/${dao?.chainID}/${dao?.daoID}/members` &&
      daoConnectedAndSameChain(address, dao?.chainID, injectedChain?.chainID)
    ) {
      return (
        <Button
          as={RouterLink}
          to={`/dao/${dao?.chainID}/${dao?.daoID}/proposals/new/member`}
        >
          Apply
        </Button>
      );
    } else if (
      location.pathname === `/dao/${dao?.chainID}/${dao?.daoID}/bank` &&
      daoConnectedAndSameChain(address, dao?.chainID, injectedChain?.chainID) &&
      dao.daoMember
    ) {
      return (
        <Button
          as={RouterLink}
          to={`/dao/${dao?.chainID}/${dao?.daoID}/proposals/new/whitelist`}
          rightIcon={<RiAddFill />}
        >
          Approve Asset
        </Button>
      );
    }
  };

  const toggleAccountModal = () => {
    if (!dao) {
      setHubAccountModal((prevState) => !prevState);
    } else {
      setDaoAccountModal((prevState) => !prevState);
    }
  };

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
          {dao ? getDaoHeading() : getHeading()}
        </Box>
        {getHeaderElement()}
      </Flex>
      <Flex
        direction='row'
        justify='flex-end'
        align='center'
        d={['none', null, null, 'flex']}
      >
        <WrongNetworkToolTip>
          {(!address && dao) || (address && !dao) ? (
            <Flex align='center' mr={5} p='5px 12px' borderRadius='20px'>
              <Box fontSize='md' fontWeight={200}>
                {injectedChain?.name}
              </Box>
            </Flex>
          ) : !daoConnectedAndSameChain(
              address,
              dao?.chainID,
              injectedChain?.chainID,
            ) ? (
            <Flex
              align='center'
              mr={5}
              background='secondary.500'
              p='5px 12px'
              borderRadius='20px'
            >
              <Icon as={RiInformationLine} mr={2} />
              <Box fontSize='md' as='i' fontWeight={600}>
                {injectedChain?.name}
              </Box>
            </Flex>
          ) : (
            <Flex align='center' mr={5} p='5px 12px' borderRadius='20px'>
              <Box fontSize='md' fontWeight={200}>
                {injectedChain?.name}
              </Box>
            </Flex>
          )}
        </WrongNetworkToolTip>

        {address ? (
          <Button variant='outline' onClick={toggleAccountModal}>
            <AddressAvatar addr={address} hideCopy={true} />
          </Button>
        ) : (
          <Button variant='outline' onClick={requestWallet}>
            Connect Wallet
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
export default Header;

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
