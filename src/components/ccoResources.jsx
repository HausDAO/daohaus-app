import React from 'react';
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Text } from '@chakra-ui/layout';

import Icon from '@chakra-ui/icon';
import { RiDiscordFill, RiLoginBoxLine } from 'react-icons/ri';
import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from './ContentBox';
import GenericModal from '../modals/genericModal';

const CcoResources = ({ daoMetaData, ccoData }) => {
  const { setGenericModal } = useOverlay();
  const { daoid, daochain } = useParams();
  const history = useHistory();

  const handleNav = () => {
    setGenericModal({});
    history.push(`/dao/${daochain}/${daoid}`);
  };

  return (
    <>
      <ContentBox variant='d2' mt={2} w='100%'>
        <Box fontSize='xl' fontWeight={700} fontFamily='heading' mb={7}>
          Resources
        </Box>
        <Box
          fontSize='lg'
          color='secondary.500'
          fontFamily='heading'
          onClick={() => setGenericModal({ aboutCcoDao: true })}
          mb={5}
          cursor='pointer'
        >
          About {daoMetaData.name}
        </Box>
        <Box
          fontSize='lg'
          color='secondary.500'
          fontFamily='heading'
          onClick={() => setGenericModal({ ccoFaq: true })}
          mb={5}
          cursor='pointer'
        >
          Rewards
        </Box>
        <Link
          href='https://daohaus.club/docs/cco'
          isExternal
          display='flex'
          alignItems='center'
          mb={5}
        >
          <Box fontSize='lg' color='secondary.500' fontFamily='heading'>
            About CCOs
          </Box>
        </Link>
      </ContentBox>

      <GenericModal modalId='aboutCcoDao'>
        <Box>
          <Text mb={3} fontFamily='heading'>
            About {daoMetaData.name}
          </Text>
          <Text mb={5}>{daoMetaData.description}</Text>
          {ccoData.faqLink && (
            <Link href={ccoData.faqLink} onClick={handleNav} isExternal>
              <Flex>
                <Text _hover={{ color: 'secondary.400', cursor: 'pointer' }}>
                  FAQ
                </Text>
                <Icon
                  as={RiLoginBoxLine}
                  color='secondary.500'
                  h='25px'
                  w='25px'
                />
              </Flex>
            </Link>
          )}

          <RouterLink
            to={`/dao/${daochain}/${daoid}`}
            onClick={handleNav}
            _hover={{ color: 'secondary.400', cursor: 'pointer' }}
          >
            <Flex>
              <Text color='black.500'>Visit DAO Interface</Text>
              <Icon
                as={RiLoginBoxLine}
                color='secondary.500'
                h='25px'
                w='25px'
              />
            </Flex>
          </RouterLink>
          <Link
            href={daoMetaData.links.discord}
            target='_blank'
            rel='noreferrer noopener'
            m={3}
          >
            <Flex>
              <Icon
                as={RiDiscordFill}
                h='30px'
                w='30px'
                color='secondary.500'
              />
              <Text>Join the DAOsquare Discord for help</Text>
            </Flex>
          </Link>
        </Box>
      </GenericModal>
      <GenericModal modalId='ccoFaq'>
        <Box>
          <Text mb={3} fontFamily='heading'>
            Rewards
          </Text>
          <Text mb={5}>{ccoData.rewards}</Text>
        </Box>
      </GenericModal>
    </>
  );
};

export default CcoResources;
