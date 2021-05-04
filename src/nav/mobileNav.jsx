import React, { useState } from 'react';
import { Flex, Box, Button, Icon } from '@chakra-ui/react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';

import ChangeDao from './changeDao';
import NavLinkList from './navLinkList';
import SocialsLinkList from './socialsLinkList';
import AddressAvatar from '../components/addressAvatar';
import DaosquareBrand from './daosquareBrand';
import Brand from './brand';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';

import '../global.css';

const MobileNav = ({ dao, daosquarecco }) => {
  const { address, requestWallet } = useInjectedProvider();
  const { setHubAccountModal, setDaoAccountModal } = useOverlay();
  const [isOpen, setIsOpen] = useState(
    JSON.parse(localStorage.getItem('sideNavOpen')),
  );

  const toggleNav = () => {
    localStorage.setItem('sideNavOpen', `${!isOpen}`);
    setIsOpen(prevState => !prevState);
  };

  const toggleAccountModal = () => {
    if (!dao) {
      setHubAccountModal(prevState => !prevState);
    } else {
      setDaoAccountModal(prevState => !prevState);
    }
  };

  return (
    <Flex
      p={5}
      position='absolute'
      direction='column'
      align='start'
      justifyContent='start'
      bg='primary.500'
      zIndex='5'
      w='100%'
      minH='80px'
      overflow='hidden'
    >
      <Flex direction='row' justify='start' align='center' w='100%' wrap='wrap'>
        <Flex
          align='center'
          justify='space-between'
          direction='row'
          w='100%'
          wrap='wrap'
        >
          {!daosquarecco ? (
            <>
              <Brand dao={dao} />
              <Box
                order={2}
                ml={3}
                borderWidth='thin'
                borderColor='whiteAlpha.400'
                borderRadius='25px'
              >
                <ChangeDao />
              </Box>
            </>
          ) : (
            <DaosquareBrand />
          )}

          <Box
            d={['inline-block', null, null, 'none']}
            order='3'
            ml='auto'
            mr={2}
          >
            {address ? (
              <Button variant='outline' onClick={toggleAccountModal}>
                <AddressAvatar addr={address} hideCopy />
              </Button>
            ) : (
              <Button variant='outline' onClick={requestWallet}>
                Connect Wallet
              </Button>
            )}
          </Box>
          {!daosquarecco && (
            <Button
              onClick={toggleNav}
              order='4'
              variant='ghost'
              color='secondary.500'
            >
              <Icon as={isOpen ? RiCloseLine : RiMenu3Line} />
            </Button>
          )}
        </Flex>
      </Flex>

      <Flex
        direction='column'
        wrap='wrap'
        h={isOpen ? '100vh' : '0px'}
        transition='all .25s ease-in-out'
        overflowY='auto'
      >
        <NavLinkList dao={dao} view='mobile' toggleNav={toggleNav} />
        <Box mt={5}>
          <Flex direction='row' align='center' justify='start'>
            <SocialsLinkList dao={dao} toggleNav={toggleNav} view='mobile' />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MobileNav;
