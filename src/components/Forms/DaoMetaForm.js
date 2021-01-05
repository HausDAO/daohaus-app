import React, { useRef } from 'react';
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
  ButtonGroup,
  FormHelperText,
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

import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import { themeImagePath } from '../../utils/helpers';
import {
  useModals,
  useNetwork,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { ipfsPost, ipfsPrePost, put } from '../../utils/requests';
import { useState } from 'react/cjs/react.development';
import { daoPresets } from '../../content/summon-presets';
import GenericModal from '../Modal/GenericModal';

const puposes = daoPresets(1).map((preset) => preset.presetName);

const DaoMetaForm = ({ metadata, handleUpdate }) => {
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();
  const [network] = useNetwork();
  const { modals, openModal, closeModals } = useModals();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [ipfsHash, setIpfsHash] = useState();
  const [loading, setLoading] = useState();
  const [uploading, setUploading] = useState();
  const { register, handleSubmit } = useForm();
  let upload = useRef();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const messageHash = web3Connect.web3.utils.sha3(metadata.address);
      const signature = await web3Connect.web3.eth.personal.sign(
        messageHash,
        user.username,
      );

      if (ipfsHash) {
        data.avatarImg = ipfsHash;
      }
      data.tags = data.tags.split(',');

      const updateData = {
        ...data,
        contractAddress: metadata.address,
        network: network.network,
        summonerAddress: metadata.summonerAddress,
        version: metadata.version,
        signature,
      };

      await put('dao/update', updateData);

      handleUpdate(data);
    } catch (err) {
      // handle error messaging
      console.log('err', err);
      setLoading(false);
    }
  };

  const handleBrowse = () => {
    upload.value = null;
    upload.click();
  };

  const handleFileSet = async (event) => {
    setImageUrl(URL.createObjectURL(upload.files[0]));
    const formData = new FormData();
    formData.append('file', upload.files[0]);
    setImageUpload(formData);
    openModal('imageHandler');
  };

  const handleUpload = async () => {
    setUploading(true);
    const keyRes = await ipfsPrePost('dao/ipfs-key', {
      daoAddress: metadata.address,
    });
    const ipfsRes = await ipfsPost(keyRes, imageUpload);
    setIpfsHash(ipfsRes.IpfsHash);
    setImageUpload(null);
    setImageUrl(null);
    setUploading(false);
    closeModals();
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
                <FormControl id='avatarImg' mb={4}>
                  <Flex direction='row'>
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

                    <Button
                      id='avatarImg'
                      variant='outline'
                      onClick={() => {
                        handleBrowse();
                      }}
                    >
                      {ipfsHash || metadata.avatarImg
                        ? 'Change Avatar'
                        : 'Upload Avatar'}
                    </Button>

                    <input
                      type='file'
                      id='avatarImg'
                      accept='image/gif, image/jpeg, image/png'
                      multiple={false}
                      style={{ display: 'none' }}
                      ref={(ref) => (upload = ref)}
                      onChange={(e) => handleFileSet(e)}
                    />

                    <GenericModal isOpen={modals.imageHandler}>
                      <Flex align='center' direction='column'>
                        <TextBox>How&apos;s this look?</TextBox>
                        <Image
                          src={imageUrl}
                          maxH='500px'
                          objectFit='cover'
                          my={4}
                        />
                        <ButtonGroup>
                          <Button
                            variant='outline'
                            onClick={handleBrowse}
                            disabled={uploading}
                          >
                            Select Another
                          </Button>
                          <Button onClick={handleUpload} disabled={uploading}>
                            Confirm
                          </Button>
                        </ButtonGroup>
                      </Flex>
                    </GenericModal>
                  </Flex>
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
                    {puposes.map((value) => (
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
