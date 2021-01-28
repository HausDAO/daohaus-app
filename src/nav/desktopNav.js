import React from 'react';
import {
  Flex,
  Icon,
  Button,
  Box,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';
import { RiLinksLine } from 'react-icons/ri';

import Brand from './brand';
import NavLinkList from './navLinkList';
import SocialsLinkList from './socialsLinkList';
import ChangeDao from './changeDao';

const DesktopNav = ({ dao }) => {
  return (
    <Flex
      p={5}
      position={['relative', 'relative', 'relative', 'fixed']}
      direction='column'
      align='start'
      justifyContent='start'
      bg='primary.500'
      zIndex='1'
      w='100px'
      minH='100vh'
      overflow='hidden'
      overflowY='auto'
    >
      <Flex
        direction={['row', 'row', 'row', 'column']}
        justify='start'
        align={['center', 'center', 'center', 'start']}
        w='100%'
        wrap='wrap'
      >
        <Flex
          align={['center', 'center', 'center', 'start']}
          justify={['space-between', 'space-between', 'space-between', 'start']}
          direction='row'
          w='100%'
          wrap='wrap'
        >
          <Brand dao={dao} />
          <Box
            w={['auto', null, null, '100%']}
            order={[3, null, null, 3]}
            mt={[0, null, null, 6]}
          >
            <ChangeDao />
          </Box>
        </Flex>
      </Flex>
      <Flex direction='column' wrap='wrap'>
        <NavLinkList dao={dao} view='desktop' />
        <Box>
          <Popover placement='right' w='auto'>
            <Tooltip
              label='Community Links'
              aria-label='Community Links'
              placement='right'
              hasArrow
              shouldWrapChildren
            >
              <PopoverTrigger>
                <Button
                  variant='sideNav'
                  _hover={{ backgroundColor: 'white' }}
                  mt={3}
                >
                  <Icon as={RiLinksLine} w={6} h={6} />
                </Button>
              </PopoverTrigger>
            </Tooltip>
            <Portal>
              <PopoverContent w='auto'>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody w='auto'>
                  <Flex direction='row' align='center' justify='start'>
                    <SocialsLinkList dao={dao} view={'desktop'} />
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Box>
      </Flex>
    </Flex>
  );
};
export default DesktopNav;
