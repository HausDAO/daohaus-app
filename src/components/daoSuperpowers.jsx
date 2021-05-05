import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Icon, Stack } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';

import ContentBox from './ContentBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { superpowerLinks, boostList } from '../content/boost-content';
import GenericModal from '../modals/genericModal';
import BoostLaunchWrapper from './boostLaunchWrapper';

const Superpowers = ({ daoMember, daoMetaData }) => {
  const { daochain, daoid } = useParams();
  const { address, injectedChain } = useInjectedProvider();
  const { setGenericModal } = useOverlay();

  const getBoostData = key => {
    const boostData = boostList.find(boost => boost.key === key);
    const withMetaData = {
      ...boostData,
      metadata: daoMetaData?.boosts?.[key]?.metadata,
    };
    return withMetaData;
  };

  return (
    <ContentBox d='flex' flexDirection='column' position='relative'>
      <Stack spacing={3}>
        {superpowerLinks.map(link => {
          return daoMetaData?.boosts?.[link.boostKey]?.active ? (
            <Flex justify='space-between' align='center' key={link.label}>
              <GenericModal closeOnOverlayClick modalId={link.modal}>
                <BoostLaunchWrapper boost={getBoostData(link.boostKey)} />
              </GenericModal>
              <Box
                fontSize={['xs', null, null, 'md']}
                fontFamily='heading'
                fontWeight={800}
                textTransform='uppercase'
                color='whiteAlpha.900'
              >
                {link.label}
              </Box>
              <Flex align='center'>
                {daoConnectedAndSameChain(
                  address,
                  daochain,
                  injectedChain?.chainId,
                ) && daoMember?.shares > 0 ? (
                  link.modal ? (
                    <Box
                      onClick={() => setGenericModal({ [link.modal]: true })}
                      _hover={{ cursor: 'pointer' }}
                    >
                      <Icon
                        as={VscGear}
                        color='secondary.500'
                        w='25px'
                        h='25px'
                        mr={3}
                      />
                    </Box>
                  ) : (
                    <RouterLink to={`/dao/${daochain}/${daoid}/${link.link}`}>
                      <Icon
                        as={VscGear}
                        color='secondary.500'
                        w='25px'
                        h='25px'
                        mr={3}
                      />
                    </RouterLink>
                  )
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
          ) : null;
        })}
      </Stack>
    </ContentBox>
  );
};

export default Superpowers;
