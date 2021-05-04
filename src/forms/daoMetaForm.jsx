import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Flex,
  FormControl,
  Input,
  Textarea,
  Image,
  Stack,
  InputGroup,
  InputLeftAddon,
  Box,
  Button,
  Spinner,
  Select,
  FormHelperText,
  HStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import {
  RiDiscordFill,
  RiTelegramFill,
  RiTwitterFill,
  RiGlobeLine,
  RiMediumFill,
} from 'react-icons/ri';
import { AiOutlineCaretDown, AiFillQuestionCircle } from 'react-icons/ai';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { daoPresets } from '../utils/summoning';
import { put, themeImagePath } from '../utils/metadata';
import ImageUploadModal from '../modals/imageUploadModal';
import { getQueryStringParams } from '../utils/general';
import { supportedChains } from '../utils/chain';

const puposes = daoPresets('0x1').map(preset => preset.presetName);

const DaoMetaForm = ({ metadata, handleUpdate }) => {
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const [ipfsHash, setIpfsHash] = useState();
  const [loading, setLoading] = useState();
  const [uploading, setUploading] = useState();
  const { register, handleSubmit } = useForm();
  const location = useLocation();

  const onSubmit = async data => {
    setLoading(true);

    try {
      const messageHash = injectedProvider.utils.sha3(metadata.address);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );

      if (ipfsHash) {
        data.avatarImg = ipfsHash;
      }
      data.tags = data.tags.split(',');

      const updateData = {
        ...data,
        contractAddress: metadata.address,
        network: injectedChain.network,
        version: metadata.version,
        signature,
      };

      if (location.search) {
        const searchParams = getQueryStringParams(location.search);
        if (searchParams.parentDao && searchParams.parentChainId) {
          const ally = {
            parent: searchParams.parentDao,
            parentNetwork: supportedChains[searchParams.parentChainId].network,
            allyType: 'uberHausBurner',
          };

          updateData.ally = ally;
        }
      }

      const res = await put('dao/update', updateData);

      if (res.error) {
        throw res.error;
      }

      handleUpdate(data);
    } catch (err) {
      console.log('err', err);
      setLoading(false);
    }
  };

  return (
    <Flex as={ContentBox} w='100%'>
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
                <FormControl id='avatarImg' mb={4}>
                  <HStack spacing={4}>
                    {ipfsHash || metadata.avatarImg ? (
                      <>
                        <Image
                          src={themeImagePath(ipfsHash || metadata.avatarImg)}
                          alt='brand image'
                          w='50px'
                          h='50px'
                        />
                      </>
                    ) : null}

                    <ImageUploadModal
                      ipfsHash={ipfsHash}
                      setIpfsHash={setIpfsHash}
                      setUploading={setUploading}
                      uploading={uploading}
                      matchMeta={metadata?.avatarImg}
                      setLabel='Upload Avatar'
                      changeLabel='Change Avatar'
                    />
                  </HStack>
                </FormControl>
                <FormControl id='name' mb={4}>
                  <TextBox size='xs' mb={2}>
                    Name
                  </TextBox>
                  <Flex>
                    <Input
                      ref={register({ required: true })}
                      defaultValue={metadata.name}
                      placeholder='Name your DAO...'
                      name='name'
                    />
                  </Flex>
                </FormControl>

                <FormControl id='description' mb={4}>
                  <TextBox size='xs' mb={2}>
                    Description
                  </TextBox>
                  <Textarea
                    ref={register({ required: true })}
                    defaultValue={metadata.description}
                    placeholder='Describe your DAO...'
                    name='description'
                  />
                </FormControl>

                <FormControl id='purpose' mb={4}>
                  <TextBox size='xs' mb={2}>
                    Purpose
                  </TextBox>

                  <Select
                    ref={register({ required: true })}
                    defaultValue={metadata.purpose || 'Grants'}
                    w='80%'
                    icon={<AiOutlineCaretDown />}
                    name='purpose'
                  >
                    {puposes.map(value => (
                      <Box as='option' key={value}>
                        {value}
                      </Box>
                    ))}
                  </Select>
                </FormControl>

                <FormControl id='tags' mb={4}>
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
                <Stack spacing={2}>
                  <FormControl id='website' mb={4}>
                    <InputGroup>
                      <InputLeftAddon bg='transparent'>
                        <RiGlobeLine />
                      </InputLeftAddon>
                      <Input
                        ref={register}
                        defaultValue={metadata.links?.website}
                        placeholder='https://daohaus.club'
                        name='links.website'
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
                        name='links.twitter'
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
                        name='links.discord'
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
                        name='links.telegram'
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
                        name='links.medium'
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl id='medium' mb={4}>
                    <InputGroup>
                      <InputLeftAddon bg='transparent'>
                        <AiFillQuestionCircle />
                      </InputLeftAddon>
                      <Input
                        ref={register}
                        defaultValue={metadata.links?.other}
                        placeholder='https://hotdogs.com'
                        name='links.other'
                      />
                    </InputGroup>
                  </FormControl>
                </Stack>

                <Button type='submit' disabled={loading} my={4}>
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
