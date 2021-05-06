import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Link, Text } from '@chakra-ui/layout';

import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
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
        <Box
          fontSize='xl'
          fontWeight={700}
          fontFamily='heading'
          mb={7}
          color='blackAlpha.900'
        >
          Resources
        </Box>
        <TextBox
          fontSize='sm'
          color='secondary.500'
          onClick={() => setGenericModal({ aboutCcoDao: true })}
          mb={5}
          cursor='pointer'
        >
          About {daoMetaData.name}
        </TextBox>
        <Link
          href='https://daohaus.club/docs/cco'
          isExternal
          display='flex'
          alignItems='center'
          mb={5}
        >
          <TextBox fontSize='sm' color='secondary.500'>
            About CCOs
          </TextBox>
        </Link>
        <TextBox
          fontSize='sm'
          color='secondary.500'
          onClick={() => setGenericModal({ ccoFaq: true })}
          mb={5}
          cursor='pointer'
        >
          Rewards
        </TextBox>
      </ContentBox>

      <GenericModal modalId='aboutCcoDao'>
        <Box>
          <Text mb={3} fontFamily='heading'>
            About {daoMetaData.name}
          </Text>
          <Text mb={5}>{ccoData.projectDescription}</Text>
          <Text
            onClick={handleNav}
            _hover={{ color: 'secondary.400', cursor: 'pointer' }}
          >
            Visit DAO Interface
          </Text>
        </Box>
      </GenericModal>
      <GenericModal modalId='ccoFaq'>
        <Box>
          <Text mb={3} fontFamily='heading'>
            FAQ
          </Text>
          <Text mb={5}>{ccoData.faqs}</Text>
        </Box>
      </GenericModal>
    </>
  );
};

export default CcoResources;
