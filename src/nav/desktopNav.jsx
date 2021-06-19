import React, { useMemo } from 'react';
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
import styled from '@emotion/styled';

import Brand from './brand';
import NavLinkList from './navLinkList';
import SocialsLinkList from './socialsLinkList';
import ChangeDao from './changeDao';
import DaosquareBrand from './daosquareBrand';

import {
  defaultSocialLinks,
  generateDaoSocials,
  generateDiscourseLink,
} from '../utils/navLinks';

const TemporaryPopoverFix = styled.span`
  .css-n0uled {
    max-width: fit-content;
  }
`;

const DesktopNav = ({ dao, daosquarecco }) => {
  const { socialLinks, discourseLinkData } = useMemo(() => {
    return {
      socialLinks: dao?.daoMetaData?.links
        ? generateDaoSocials(dao?.daoMetaData?.links)
        : defaultSocialLinks,
      discourseLinkData: dao?.daoMetaData?.boosts?.discourse?.active
        ? generateDiscourseLink(dao.daoMetaData.boosts.discourse.metadata)
        : null,
    };
  }, [dao]);

  const isCommunityLinkProvided = useMemo(
    () => socialLinks.length > 0 || discourseLinkData,
    [discourseLinkData, socialLinks],
  );

  return (
    <Flex
      p={5}
      position={['relative', 'relative', 'relative', 'fixed']}
      direction='column'
      align='start'
      justifyContent='start'
      bg={daosquarecco ? '#FFD3FF' : 'primary.500'}
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
          {!daosquarecco ? (
            <>
              <Brand dao={dao} />
              <Box
                w={['auto', null, null, '100%']}
                order={[3, null, null, 3]}
                mt={[0, null, null, 6]}
              >
                <ChangeDao />
              </Box>
            </>
          ) : (
            <DaosquareBrand />
          )}
        </Flex>
      </Flex>
      <Flex direction='column' wrap='wrap'>
        {!daosquarecco && (
          <>
            <NavLinkList dao={dao} view='desktop' />
            <Box>
              <Popover placement='right' w='auto' enabled={false}>
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
                      _hover={{
                        backgroundColor: isCommunityLinkProvided
                          ? 'white'
                          : 'transparent',
                        cursor: isCommunityLinkProvided
                          ? 'pointed'
                          : 'not-allowed',
                      }}
                      mt={3}
                    >
                      <Icon as={RiLinksLine} w={6} h={6} />
                    </Button>
                  </PopoverTrigger>
                </Tooltip>
                {isCommunityLinkProvided && (
                  <Portal>
                    <TemporaryPopoverFix>
                      <PopoverContent width='fit-content' pr='1rem'>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody w='auto'>
                          <Flex direction='row' align='center' justify='start'>
                            <SocialsLinkList
                              socialLinks={socialLinks}
                              discourseLinkData={discourseLinkData}
                              dao={dao}
                              view='desktop'
                            />
                          </Flex>
                        </PopoverBody>
                      </PopoverContent>
                    </TemporaryPopoverFix>
                  </Portal>
                )}
              </Popover>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default DesktopNav;
