import React from 'react';
import {
  Flex,
  // Editable,
  // EditableInput,
  // EditablePreview,
  FormControl,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useDao } from '../../contexts/PokemolContext';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';

const CustomTheme = () => {
  const [dao] = useDao();
  const { handleSubmit, register } = useForm();
  console.log(dao);

  return (
    <Flex>
      <Flex as={ContentBox} m={6} w='35%'>
        {dao && (
          <Flex as='form' onSubmit={handleSubmit} direction='column' w='100%'>
            <FormControl name='daoName' mb={4} w='75%'>
              <TextBox size='sm'>Name</TextBox>
              <Input
                ref={register}
                defaultValue={dao.name}
                placeholder='DAOhaus'
              />
            </FormControl>

            <FormControl name='daoDescription' mb={4}>
              <TextBox size='sm'>Description</TextBox>
              <Textarea
                ref={register}
                defaultValue={dao.description}
                placeholder='A DAO of DAOs'
              />
            </FormControl>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default CustomTheme;
