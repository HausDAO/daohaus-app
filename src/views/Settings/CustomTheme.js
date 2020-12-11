import React from 'react';
import { Flex, Box, Button, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import { useDao } from '../../contexts/PokemolContext';
import ThemeColorsForm from '../../components/Forms/ThemeColorsForm';
// import ThemePreview from '../../components/Settings/ThemePreview';

const CustomTheme = () => {
  const [dao] = useDao();

  return (
    <Box w='40%'>
      <Flex ml={6} justify='space-between' align='center' w='100%'>
        <Flex
          as={RouterLink}
          to={`/dao/${dao.address}/settings`}
          align='center'
        >
          <Icon as={BiArrowBack} color='secondary.500' mr={2} />
          Back
        </Flex>
        <Button>Save</Button>
      </Flex>
      <ThemeColorsForm />

      {/* <ThemePreview /> */}
    </Box>
  );
};

export default CustomTheme;
