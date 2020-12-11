import React from 'react';
import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import { useDao } from '../../contexts/PokemolContext';
import DaoMetaForm from '../../components/Forms/DaoMetaForm';

const DaoMetadata = () => {
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
      <DaoMetaForm />
    </Box>
  );
};

export default DaoMetadata;
