import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Flex, Icon, Link } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';
import { RiExternalLinkLine } from 'react-icons/ri';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const Superpowers = ({ daoMember, daoMetaData }) => {
  const { daochain, daoid } = useParams();
  const { address, injectedChain } = useInjectedProvider();

  const daoConnectedAndSameChain = () => {
    return address && daochain && injectedChain?.chainId === daochain;
  };

  return (
    <ContentBox d='flex' flexDirection='column' position='relative'>
      {daoMetaData?.boosts?.customTheme?.active ? (
        <Flex p={4} justify='space-between' align='center'>
          <TextBox size='md' colorScheme='whiteAlpha.900'>
            Custom Theme
          </TextBox>
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
              <TextBox colorScheme='whiteAlpha.900' size='xs' maxW='250px'>
                Active Members only
              </TextBox>
            )}
          </Flex>
        </Flex>
      ) : null}

      {daoMetaData?.boosts?.notificationsLevel1?.active ? (
        <Flex p={4} justify='space-between' align='center'>
          <TextBox size='md' colorScheme='whiteAlpha.900'>
            Notifications
          </TextBox>
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
              <TextBox colorScheme='whiteAlpha.900' size='xs'>
                Active Members only
              </TextBox>
            )}
          </Flex>
        </Flex>
      ) : null}

      {daoMetaData?.boosts?.discourse?.active ? (
        <Flex p={4} justify='space-between' align='center'>
          <TextBox size='md' colorScheme='whiteAlpha.900'>
            Discourse Forum
          </TextBox>
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
    </ContentBox>
  );
};

export default Superpowers;
