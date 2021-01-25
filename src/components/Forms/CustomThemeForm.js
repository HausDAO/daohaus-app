import React, { useState, useRef } from 'react';
import {
  Avatar,
  Button,
  Flex,
  Stack,
  ButtonGroup,
  Box,
  Select,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { SketchPicker } from 'react-color';
import { useModals, useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import GenericModal from '../Modal/GenericModal';
import { ipfsPost, ipfsPrePost } from '../../utils/requests';
import { themeImagePath } from '../../utils/helpers';

const bodyFonts = [
  'Rubik',
  'Merriweather',
  'Space Grotesk',
  'Montserrat',
  'Playfair Display',
  'Rokkitt',
];

const headingFonts = [
  'Inknut Antiqua',
  'Bungee',
  'Abril Fatface',
  ...bodyFonts,
];

const dataFonts = [
  'Space Mono',
  'JetBrains Mono',
  'Roboto Mono',
  'Cutive Mono',
];

const CustomThemeForm = ({ previewTheme, setPreviewTheme }) => {
  const [theme] = useTheme();
  const [dao] = useDao();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePicker, setImagePicker] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(null);
  const [uploading, setUploading] = useState();
  const { modals, openModal, closeModals } = useModals();
  let upload = useRef();

  const handleChange = (color, item) => {
    setPreviewTheme({
      ...previewTheme,
      [item]: color.hex,
    });
  };

  const handleSelectChange = (event) => {
    setPreviewTheme({
      ...previewTheme,
      [event.target.id]: event.target.value,
    });
  };

  const handleBrowse = () => {
    upload.value = null;
    upload.click();
  };

  const handleClearImage = () => {
    setPreviewTheme({
      ...previewTheme,
      bgImg: '',
    });
  };

  const handleWordsChange = (event) => {
    const { name, value } = event.target;
    const updatedThemeWords = {
      ...previewTheme.daoMeta,
      [name]: value,
    };
    setPreviewTheme({
      ...previewTheme,
      daoMeta: updatedThemeWords,
    });
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
      daoAddress: dao.address,
    });
    const ipfsRes = await ipfsPost(keyRes, imageUpload);
    setPreviewTheme({
      ...previewTheme,
      [imagePicker]: ipfsRes.IpfsHash,
    });
    setImagePicker(null);
    setImageUpload(null);
    setImageUrl(null);
    setUploading(false);
    closeModals();
  };

  const renderWordsFields = () => {
    return Object.keys(previewTheme.daoMeta).map((themeKey) => {
      return (
        <FormControl mb={4} key={themeKey}>
          <TextBox size='xs' mb={1}>
            {themeKey}
          </TextBox>
          <Input
            defaultValue={previewTheme.daoMeta[themeKey]}
            placeholder={themeKey}
            name={themeKey}
            onChange={handleWordsChange}
          />
        </FormControl>
      );
    });
  };

  return (
    <Box p={6}>
      <ContentBox>
        <Tabs isFitted isLazy variant='unstyled'>
          <TabList>
            <Tab>Style</Tab>
            <Tab>Wording</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <GenericModal isOpen={modals.imageHandler}>
                <Flex align='center' direction='column'>
                  <TextBox>How&apos;s this look?</TextBox>
                  <Image src={imageUrl} maxH='500px' objectFit='cover' my={4} />
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
              <Stack spacing={4} pr='5%'>
                <TextBox size='xs'>Colors</TextBox>
                <Flex justify='space-between' align='center'>
                  <TextBox size='sm'>Primary</TextBox>
                  <Box>
                    <Box
                      w='35px'
                      h='35px'
                      borderRadius='25px'
                      border={`1px solid ${theme.colors.whiteAlpha[800]}`}
                      bg={previewTheme?.primary500}
                      onClick={() => setPickerOpen('primary')}
                      _hover={{ cursor: 'pointer' }}
                    />
                    {pickerOpen === 'primary' ? (
                      <Box position='absolute' zIndex={2}>
                        <Box
                          position='fixed'
                          top='0px'
                          right='0px'
                          bottom='0px'
                          left='0px'
                          onClick={() => setPickerOpen(null)}
                        />
                        <SketchPicker
                          color={previewTheme?.primary500}
                          onChangeComplete={(color) =>
                            handleChange(color, 'primary500')
                          }
                          disableAlpha={true}
                        />
                      </Box>
                    ) : null}
                  </Box>
                </Flex>
                <Flex justify='space-between' align='center'>
                  <TextBox size='sm'>Secondary</TextBox>
                  <Box>
                    <Box
                      w='35px'
                      h='35px'
                      borderRadius='25px'
                      border={`1px solid ${theme.colors.whiteAlpha[800]}`}
                      bg={previewTheme?.secondary500}
                      onClick={() => setPickerOpen('secondary')}
                      _hover={{ cursor: 'pointer' }}
                    />
                    {pickerOpen === 'secondary' ? (
                      <Box position='absolute' zIndex={2}>
                        <Box
                          position='fixed'
                          top='0px'
                          right='0px'
                          bottom='0px'
                          left='0px'
                          onClick={() => setPickerOpen(null)}
                        />
                        <SketchPicker
                          color={previewTheme?.secondary500}
                          onChange={(color) =>
                            handleChange(color, 'secondary500')
                          }
                          disableAlpha={true}
                        />
                      </Box>
                    ) : null}
                  </Box>
                </Flex>
                <Flex justify='space-between' align='center'>
                  <TextBox size='sm'>Background</TextBox>
                  <Box>
                    <Box
                      w='35px'
                      h='35px'
                      borderRadius='25px'
                      border={`1px solid ${theme.colors.whiteAlpha[800]}`}
                      bg={previewTheme?.bg500}
                      onClick={() => setPickerOpen('background')}
                      _hover={{ cursor: 'pointer' }}
                    />
                    {pickerOpen === 'background' ? (
                      <Box position='absolute' zIndex={2}>
                        <Box
                          position='fixed'
                          top='0px'
                          right='0px'
                          bottom='0px'
                          left='0px'
                          onClick={() => setPickerOpen(null)}
                        />
                        <SketchPicker
                          color={previewTheme?.bg500}
                          onChange={(color) => handleChange(color, 'bg500')}
                          disableAlpha={true}
                        />
                      </Box>
                    ) : null}
                  </Box>
                </Flex>

                <TextBox size='xs'>Fonts</TextBox>
                <Box>
                  <TextBox size='sm' mb={1}>
                    Heading
                  </TextBox>
                  <Select
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
                  </Select>
                </Box>
                <Box>
                  <TextBox size='sm' mb={1}>
                    Body
                  </TextBox>
                  <Select
                    defaultValue={
                      previewTheme.headingFont
                        ? previewTheme.headingFont
                        : 'Inknut Antiqua'
                    }
                    onChange={handleSelectChange}
                    w='80%'
                    icon={<AiOutlineCaretDown />}
                    name='bodyFont'
                    id='bodyFont'
                  >
                    {bodyFonts.map((value) => (
                      <Box as='option' key={value}>
                        {value}
                      </Box>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <TextBox size='sm' mb={1}>
                    Data
                  </TextBox>
                  <Select
                    defaultValue={
                      previewTheme.headingFont
                        ? previewTheme.headingFont
                        : 'Inknut Antiqua'
                    }
                    onChange={handleSelectChange}
                    w='80%'
                    icon={<AiOutlineCaretDown />}
                    name='monoFont'
                    id='monoFont'
                  >
                    {dataFonts.map((value) => (
                      <Box as='option' key={value} id={value}>
                        {value}
                      </Box>
                    ))}
                  </Select>
                </Box>
              </Stack>

              <Flex direction='column' justify='center' my={6}>
                <TextBox size='sm' mb={1}>
                  Images
                </TextBox>
                <ButtonGroup>
                  <Box>
                    <Button
                      id='bgImg'
                      mb={3}
                      variant='outline'
                      onClick={() => {
                        setImagePicker('bgImg');
                        handleBrowse();
                      }}
                    >
                      Background
                    </Button>
                    {previewTheme?.bgImg ? (
                      <>
                        <Avatar
                          src={themeImagePath(previewTheme.bgImg)}
                          alt='background image'
                          w='50px'
                          h='50px'
                        />
                        <Button
                          variant='outline'
                          fontSize='xs'
                          onClick={() => {
                            handleClearImage();
                          }}
                          _hover={{ cursor: 'pointer' }}
                        >
                          Clear Background Image
                        </Button>
                      </>
                    ) : null}
                  </Box>
                </ButtonGroup>
                <input
                  type='file'
                  id='bgImg'
                  accept='image/gif, image/jpeg, image/png'
                  multiple={false}
                  style={{ display: 'none' }}
                  ref={(ref) => (upload = ref)}
                  onChange={(e) => handleFileSet(e)}
                />
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex direction='column' my={6}>
                <TextBox size='xs' mb={3}>
                  Interface Words
                </TextBox>

                {renderWordsFields()}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ContentBox>
    </Box>
  );
};

export default CustomThemeForm;
