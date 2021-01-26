import React from 'react';
// import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  // Avatar,
  Flex,
  // Icon,
  // Link,
  // Button,
  // Box,
  Stack,
  // Tooltip,
  // IconButton,
  // Popover,
  // PopoverTrigger,
  // PopoverContent,
  // PopoverBody,
  // PopoverArrow,
  // PopoverCloseButton,
  // Portal,
} from '@chakra-ui/react';

import Brand from './brand';
import NavLink from './navlink';

// import { Web3SignIn } from "../Shared/Web3SignIn";
// import UserAvatar from "../Shared/UserAvatar";
// import AccountModal from "../Modal/AccountModal";
// import BrandImg from "../../assets/Daohaus__Castle--Dark.svg";
// import "../../global.css";

// import { themeImagePath } from "../../utils/helpers";
// import { defaultSocialLinks } from "../../content/socials";

const DesktopNav = ({ navLinks, brand }) => {
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
      <Brand brandImg={brand?.brandImg} brandPath={brand?.brandPath} />
      <Flex direction='column' wrap='wrap'>
        <Stack
          spacing={[1, null, null]}
          d='flex'
          mt={[3, null, null, 12]}
          flexDirection='column'
        >
          {navLinks &&
            navLinks.map((link) => {
              return (
                <NavLink
                  key={link.path || link.href}
                  label={link.label}
                  path={link.path}
                  href={link.href}
                  icon={link.icon}
                />
              );
            })}
        </Stack>

        {/* <Box>
          <Popover placement="right" w="auto">
            <Tooltip
              label="Community Links"
              aria-label="Community Links"
              placement="right"
              hasArrow
            >
              <PopoverTrigger>
                <Button
                  variant="sideNav"
                  _hover={{ backgroundColor: "white" }}
                  mt={3}
                >
                  <Icon as={RiLinksLine} w={6} h={6} />
                </Button>
              </PopoverTrigger>
            </Tooltip>
            <Portal>
              <PopoverContent w="auto">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody w="auto">
                  <Flex direction="row" align="center" justify="start">
                    {!dao.address || dao.links?.website ? (
                      <Tooltip
                        label="Website"
                        aria-label="Website"
                        placement="top"
                        hasArrow
                      >
                        <IconButton
                          as={Link}
                          icon={<RiGlobeLine />}
                          href={
                            !dao.address
                              ? defaultSocialLinks.website
                              : dao.links.website
                          }
                          isExternal
                          size="lg"
                          variant="link"
                          isRound="true"
                        />
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.discord ? (
                      <Tooltip
                        label="Discord"
                        aria-label="Discord"
                        placement="top"
                        hasArrow
                      >
                        <IconButton
                          as={Link}
                          icon={<RiDiscordFill />}
                          href={
                            !dao.address
                              ? defaultSocialLinks.discord
                              : dao.links.discord
                          }
                          isExternal
                          size="lg"
                          variant="link"
                          isRound="true"
                        />
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.telegram ? (
                      <Tooltip
                        label="Telegram"
                        aria-label="Telegram"
                        placement="top"
                        hasArrow
                      >
                        <IconButton
                          as={Link}
                          icon={<RiTelegramFill />}
                          href={
                            !dao.address
                              ? defaultSocialLinks.telegram
                              : dao.links.telegram
                          }
                          isExternal
                          size="lg"
                          variant="link"
                          isRound="true"
                        />
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.medium ? (
                      <Tooltip
                        label="Blog"
                        aria-label="Blog"
                        placement="top"
                        hasArrow
                      >
                        <IconButton
                          as={Link}
                          icon={<RiMediumFill />}
                          href={
                            !dao.address
                              ? defaultSocialLinks.medium
                              : dao.links.medium
                          }
                          isExternal
                          size="lg"
                          variant="link"
                          isRound="true"
                        />
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.twitter ? (
                      <Tooltip
                        label="Twitter"
                        aria-label="Twitter"
                        placement="top"
                        hasArrow
                      >
                        <IconButton
                          as={Link}
                          icon={<RiTwitterFill />}
                          href={`https://twitter.com/${
                            !dao.address
                              ? defaultSocialLinks.twitter
                              : dao.links.twitter
                          }`}
                          isExternal
                          size="lg"
                          variant="link"
                          isRound="true"
                        />
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.other ? (
                      <Tooltip
                        label="Other"
                        aria-label="Other"
                        placement="top"
                        hasArrow
                      >
                        <IconButton
                          as={Link}
                          icon={<RiLinksLine />}
                          href={
                            !dao.address
                              ? defaultSocialLinks.other
                              : dao.links.other
                          }
                          isExternal
                          size="lg"
                          variant="link"
                          isRound="true"
                        />
                      </Tooltip>
                    ) : null}
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Box> */}
      </Flex>
    </Flex>
  );
};

export default DesktopNav;
