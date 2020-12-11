import React from 'react';
import {
  Flex,
  FormControl,
  Input,
  Textarea,
  Image,
  FormHelperText,
  Stack,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import {
  RiDiscordFill,
  RiTelegramFill,
  RiTwitterFill,
  RiGlobeLine,
  RiMediumFill,
} from 'react-icons/ri';

import { useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';

const DaoMetaForm = () => {
  const [dao] = useDao();
  const [theme] = useTheme();
  const { handleSubmit, register } = useForm();

  return (
    <Flex as={ContentBox} m={6} w='100%'>
      {dao && (
        <Flex as='form' onSubmit={handleSubmit} direction='column' w='100%'>
          <FormControl id='name' mb={4}>
            <TextBox size='xs' mb={2}>
              Avatar & Name
            </TextBox>
            <Flex>
              <Image
                src={theme.images.brandImg}
                borderRadius='40px'
                height='50px'
                width='50px'
              />
              <Input
                ref={register}
                defaultValue={dao.name}
                placeholder='DAOhaus'
                name='name'
                ml={5}
              />
            </Flex>
          </FormControl>

          <FormControl id='description' mb={4}>
            <TextBox size='xs' mb={2}>
              Description
            </TextBox>
            <Textarea
              ref={register}
              defaultValue={dao.description}
              placeholder='A DAO of DAOs'
              name='description'
            />
          </FormControl>

          <FormControl id='purpose' mb={4}>
            <TextBox size='xs' mb={2}>
              Purpose
            </TextBox>
            <Input
              ref={register}
              defaultValue={dao.purpose}
              placeholder='To bring creativity and happiness to the realm.'
              name='purpose'
            />
          </FormControl>

          <FormControl id='tags' mb={4}>
            <TextBox size='xs' mb={2}>
              Tags
            </TextBox>
            <Input
              ref={register}
              defaultValue={dao.tags}
              placeholder='Ethereum, Clubs'
              name='tags'
            />
            <FormHelperText>Comma-separated list</FormHelperText>
          </FormControl>

          <TextBox size='xs' mb={2}>
            Community Links
          </TextBox>
          <Stack spacing='2px'>
            <FormControl id='website' mb={4}>
              <InputGroup>
                <InputLeftAddon bg='transparent'>
                  <RiGlobeLine />
                </InputLeftAddon>
                <Input
                  ref={register}
                  defaultValue={theme.daoMeta.website}
                  placeholder='https://daohaus.club'
                  name='website'
                />
              </InputGroup>
            </FormControl>

            <FormControl id='twitter' mb={4}>
              <InputGroup>
                <InputLeftAddon bg='transparent'>
                  <RiTwitterFill />
                </InputLeftAddon>
                <Input
                  ref={register}
                  defaultValue={theme.daoMeta.twitter}
                  placeholder='@nowdaoit'
                  name='twitter'
                />
              </InputGroup>
            </FormControl>

            <FormControl id='discord' mb={4}>
              <InputGroup>
                <InputLeftAddon bg='transparent'>
                  <RiDiscordFill />
                </InputLeftAddon>
                <Input
                  ref={register}
                  defaultValue={theme.daoMeta.discord}
                  placeholder='https://discord.gg/k7CDCqaRSY'
                  name='discord'
                />
              </InputGroup>
            </FormControl>

            <FormControl id='telegram' mb={4}>
              <InputGroup>
                <InputLeftAddon bg='transparent'>
                  <RiTelegramFill />
                </InputLeftAddon>
                <Input
                  ref={register}
                  defaultValue={theme.daoMeta.telegram}
                  placeholder='https://t.me/'
                  name='telegram'
                />
              </InputGroup>
            </FormControl>

            <FormControl id='medium' mb={4}>
              <InputGroup>
                <InputLeftAddon bg='transparent'>
                  <RiMediumFill />
                </InputLeftAddon>
                <Input
                  ref={register}
                  defaultValue={theme.daoMeta.medium}
                  placeholder='https://medium.com/'
                  name='medium'
                />
              </InputGroup>
            </FormControl>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
};

export default DaoMetaForm;
