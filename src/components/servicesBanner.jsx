import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';

import { useMetaData } from '../contexts/MetaDataContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import ContentBox from './ContentBox';

const ServicesBanner = () => {
  const { daoMetaData } = useMetaData();
  const { theme } = useCustomTheme();
  return (
    <ContentBox
      mt={6}
      w='100%'
      style={{ background: theme.colors.primary[500] }}
    >
      <Flex align='center' justify='space-between'>
        <Box fontSize='lg' fontWeight={700} fontFamily='heading'>
          We are available for hire!
        </Box>
        <Button
          as={Link}
          href={daoMetaData.servicesUrl}
          isExternal
          variant='outline'
          color='white'
          borderColor='white'
          _hover={{ background: theme.colors.primary[600], color: 'white' }}
        >
          Hire Us
        </Button>
      </Flex>
    </ContentBox>
  );
};

export default ServicesBanner;
