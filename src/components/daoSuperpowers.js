import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Icon, Link, Stack } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';
import { RiExternalLinkLine } from 'react-icons/ri';

import ContentBox from './ContentBox';
// import TextBox from './TextBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const Superpowers = ({ daoMember, daoMetaData }) => {
  const { daochain, daoid } = useParams();
  const { address, injectedChain } = useInjectedProvider();

  const daoConnectedAndSameChain = () => {
    return address && daochain && injectedChain?.chainId === daochain;
  };

  return (
    <ContentBox d='flex' flexDirection='column' position='relative'>
      <Stack spacing={3}>
        {daoMetaData?.boosts?.customTheme?.active ? (
          <Flex justify='space-between' align='center'>
            <Box
              fontSize={['xs', null, null, 'md']}
              fontFamily='heading'
              fontWeight={800}
              textTransform='uppercase'
              color='whiteAlpha.900'
            >
              Custom Theme
            </Box>
            <Flex align='center'>
              {daoConnectedAndSameChain() && daoMember?.shares > 0 ? (
                <RouterLink to={`/dao/${daochain}/${daoid}/settings/theme`}>
                  <Icon
                    as={VscGear}
                    color='secondary.500'
                    w='25px'
                    h='25px'
                    mr={3}
                  />
                </RouterLink>
              ) : (
                <Box
                  color='whiteAlpha.900'
                  fontSize={['xs', null, null, 'sm']}
                  fontFamily='mono'
                  maxW={['auto', null, null, '250px']}
                >
                  Active Members only
                </Box>
              )}
            </Flex>
          </Flex>
        ) : null}

        {daoMetaData?.boosts?.notificationsLevel1?.active ? (
          <Flex justify='space-between' align='center'>
            <Box
              fontSize={['xs', null, null, 'md']}
              fontFamily='heading'
              fontWeight={800}
              textTransform='uppercase'
              color='whiteAlpha.900'
            >
              Notifications
            </Box>
            <Flex align='center'>
              {daoConnectedAndSameChain() && daoMember?.shares > 0 ? (
                <RouterLink
                  to={`/dao/${daochain}/${daoid}/settings/notifications`}
                >
                  <Icon
                    as={VscGear}
                    color='secondary.500'
                    w='25px'
                    h='25px'
                    mr={3}
                  />
                </RouterLink>
              ) : (
                <Box
                  color='whiteAlpha.900'
                  fontSize={['xs', null, null, 'sm']}
                  fontFamily='mono'
                  maxW={['auto', null, null, '250px']}
                >
                  Active Members only
                </Box>
              )}
            </Flex>
          </Flex>
        ) : null}

        {daoMetaData?.boosts?.discourse?.active ? (
          <Flex justify='space-between' align='center'>
            <Box
              fontSize={['xs', null, null, 'md']}
              fontFamily='heading'
              fontWeight={800}
              textTransform='uppercase'
              color='whiteAlpha.900'
            >
              Discourse Forum
            </Box>
            <Flex align='center'>
              <Link
                href={`https://forum.daohaus.club/c/${daoMetaData.boosts.discourse.metadata.slug}/${daoMetaData.boosts.discourse.metadata.categoryId}`}
                isExternal
              >
                <Icon
                  as={RiExternalLinkLine}
                  color='secondary.500'
                  w='25px'
                  h='25px'
                  mr={3}
                />
              </Link>
            </Flex>
          </Flex>
        ) : null}
      </Stack>
    </ContentBox>
  );
};

export default Superpowers;
