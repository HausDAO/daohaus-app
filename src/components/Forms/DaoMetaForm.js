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
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import {
  RiDiscordFill,
  RiTelegramFill,
  RiTwitterFill,
  RiGlobeLine,
  RiMediumFill,
} from 'react-icons/ri';

import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import { themeImagePath } from '../../utils/helpers';
import {
  useNetwork,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { put } from '../../utils/requests';
import { useState } from 'react/cjs/react.development';

const DaoMetaForm = ({ metadata, handleUpdate }) => {
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();
  const [network] = useNetwork();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState();

  const onSubmit = async (data) => {
    setLoading(true);
    console.log('onsubmit', data);

    try {
      const messageHash = web3Connect.web3.utils.sha3(metadata.address);
      const signature = await web3Connect.web3.eth.personal.sign(
        messageHash,
        user.username,
      );

      const updateData = {
        ...data,
        contractAddress: metadata.address,
        network: network.network,
        summonerAddress: metadata.summonerAddress,
        version: '2.1',
        signature,
      };

      console.log('updateData', updateData);
      console.log('testing', JSON.stringify(updateData));

      const updateRes = await put('dao/update', updateData);

      console.log('updateRes', updateRes);

      // after save we can pass that data back to the parent component to update global state or something
      handleUpdate(data);
      setLoading(false);
    } catch (err) {
      // handle error messsaging
      console.log('err', err);
      setLoading(false);
    }
  };

  return (
    <Flex as={ContentBox} m={6} w='100%'>
      <>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {metadata && (
              <Flex
                as='form'
                onSubmit={handleSubmit(onSubmit)}
                direction='column'
                w='100%'
              >
                <FormControl id='name' mb={4}>
                  <TextBox size='xs' mb={2}>
                    Name
                  </TextBox>
                  <Flex>
                    {/* <Image
                src={themeImagePath(metadata.avatarImg)}
                borderRadius='40px'
                height='50px'
                width='50px'
              /> */}
                    <Input
                      ref={register({ required: true })}
                      defaultValue={metadata.name}
                      placeholder='Braid Guild'
                      name='name'
                    />
                  </Flex>
                </FormControl>

                <FormControl id='description' mb={4}>
                  <TextBox size='xs' mb={2}>
                    Description
                  </TextBox>
                  <Textarea
                    ref={register}
                    defaultValue={metadata.description}
                    placeholder='A DAO of DAOs'
                    name='description'
                  />
                </FormControl>

                <FormControl id='purpose' mb={4}>
                  <TextBox size='xs' mb={2}>
                    Purpose
                  </TextBox>

                  {/* <Select
                    defaultValue={
                      previewTheme.headingFont
                        ? previewTheme.headingFont
                        : 'Inknut Antiqua'
                    }
                    onChange={handleSelectChange}
                    w='80%'
                    icon={<AiOutlineCaretDown />}
                    name='primaryFont'
                    id='primaryFont'
                  >
                    {headingFonts.map((value) => (
                      <Box as='option' key={value}>
                        {value}
                      </Box>
                    ))}
                  </Select> */}
                  <Input
                    ref={register}
                    defaultValue={metadata.purpose}
                    placeholder='To bring creativity and happiness to the realm.'
                    name='purpose'
                  />
                </FormControl>

                {/*  <FormControl id='tags' mb={4}>
            <TextBox size='xs' mb={2}>
              Tags
            </TextBox>
            <Input
              ref={register}
              defaultValue={metadata.tags}
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
                  defaultValue={metadata.links?.website}
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
                  defaultValue={metadata.links?.twitter}
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
                  defaultValue={metadata.links?.discord}
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
                  defaultValue={metadata.links?.telegram}
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
                  defaultValue={metadata.links?.medium}
                  placeholder='https://medium.com/'
                  name='medium'
                />
              </InputGroup>
            </FormControl>
          </Stack> */}

                <Button type='submit' disabled={loading}>
                  Save
                </Button>
              </Flex>
            )}
          </>
        )}
      </>
    </Flex>
  );
};

export default DaoMetaForm;
