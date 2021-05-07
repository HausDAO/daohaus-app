import { Box, Link, Text } from '@chakra-ui/layout';
import React from 'react';

import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import GenericModal from '../modals/genericModal';

const CcoResources = ({ daoMetaData, ccoData }) => {
  const { setGenericModal } = useOverlay();

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
        <Box
          fontSize='lg'
          color='secondary.500'
          fontFamily='heading'
          onClick={() => setGenericModal({ ccoFaq: true })}
          mb={5}
          cursor='pointer'
        >
          FAQ
        </Box>
      </ContentBox>

      <GenericModal modalId='aboutCcoDao'>
        <Box>
          <Text mb={3} fontFamily='heading'>
            About {daoMetaData.name}
          </Text>
          <Text mb={5}>{ccoData.projectDescription}</Text>
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
