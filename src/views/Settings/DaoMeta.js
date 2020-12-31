import React from 'react';
import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import { useDao } from '../../contexts/PokemolContext';
import DaoMetaForm from '../../components/Forms/DaoMetaForm';
import { useEffect, useState } from 'react/cjs/react.development';

const DaoMetadata = () => {
  const [dao] = useDao();
  const [metaUpdate, setMetaUpdate] = useState();

  //todo: finish this form

  useEffect(() => {
    console.log('dao', dao);

    // setMetaUpdate({
    //   name: dao.name,
    //   description: dao.description,
    //   avatarImg: dao.avatarImg,
    //   purpose: dao.purpose,
    //   tags: dao.tags,
    //   links: dao.links,
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao]);

  const handleSave = () => {
    console.log('saving', metaUpdate);
  };

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
        <Button onClick={handleSave}>Save</Button>
      </Flex>
      <DaoMetaForm />
    </Box>
  );
};

export default DaoMetadata;
