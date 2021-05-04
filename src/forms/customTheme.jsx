import React, { useState, useEffect } from 'react';
import {
  Image,
  Button,
  Flex,
  Stack,
  ButtonGroup,
  Box,
  Select,
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
import { useCustomTheme } from '../contexts/CustomThemeContext';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import ImageUploadModal from '../modals/imageUploadModal';
import { themeImagePath } from '../utils/metadata';

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

const monoFonts = [
  'Space Mono',
  'JetBrains Mono',
  'Roboto Mono',
  'Cutive Mono',
];

const CustomThemeForm = ({ previewTheme, setPreviewTheme }) => {
  const { theme } = useCustomTheme();
  const [pickerOpen, setPickerOpen] = useState(null);
  const [ipfsHash, setIpfsHash] = useState();
  const [uploading, setUploading] = useState();

  const handleColorChange = (color, item) => {
    setPreviewTheme({
      ...previewTheme,
      [item]: color.hex,
    });
  };

  useEffect(() => {
    if (ipfsHash) {
      setPreviewTheme({
        ...previewTheme,
        bgImg: ipfsHash,
      });
    }
  }, [ipfsHash]);

  const handleChange = event => {
    setPreviewTheme({
      ...previewTheme,
      [event.target.id]: event.target.value,
    });
  };

  const resetWords = () => {
    setPreviewTheme({
      ...previewTheme,
      daoMeta: theme.daoMeta,
    });
  };

  // const handleBgChange = (val) => {
  //   console.log(val);
  //   setPreviewTheme({
  //     ...previewTheme,
  //     bgOverlayOpacity: val / 100,
  //   });
  // };

  const handleClearImage = () => {
    setPreviewTheme({
      ...previewTheme,
      bgImg: '',
    });
  };

  const handleWordsChange = event => {
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

  const renderWordsFields = () => {
    return Object.keys(previewTheme.daoMeta).map(themeKey => {
      return (
        <FormControl mb={4} key={themeKey}>
          <TextBox size='xs' mb={1}>
            {themeKey}
          </TextBox>
          <Input
            type='text'
            placeholder={themeKey}
            name={themeKey}
            onChange={handleWordsChange}
            value={previewTheme.daoMeta[themeKey]}
          />
        </FormControl>
      );
    });
  };

  return (
    <ContentBox>
      <Tabs isFitted isLazy variant='unstyled'>
        <TabList>
          <Tab>Style</Tab>
          <Tab>Wording</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
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
                    <Box position='absolute' zIndex={5} color='black'>
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
                        onChangeComplete={color =>
                          handleColorChange(color, 'primary500')
                        }
                        disableAlpha
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
                    <Box position='absolute' zIndex={5} color='black'>
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
                        onChange={color =>
                          handleColorChange(color, 'secondary500')
                        }
                        disableAlpha
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
                    <Box position='absolute' zIndex={5} color='black'>
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
                        onChange={color => handleColorChange(color, 'bg500')}
                        disableAlpha
                      />
                    </Box>
                  ) : null}
                </Box>
              </Flex>
              <Stack spacing={2}>
                <TextBox size='sm'>Background Opacity</TextBox>
                <Box>
                  {/* <Slider
                    aria-label='bg-opacity-slider'
                    colorScheme='secondary.500'
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={previewTheme.bgOverlayOpacity * 100}
                    onChangeEnd={(val) => handleBgChange(val)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider> */}
                  <Input
                    type='text'
                    id='bgOverlayOpacity'
                    defaultValue={previewTheme.bgOverlayOpacity}
                    onChange={handleChange}
                  />
                </Box>
              </Stack>

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
                  onChange={handleChange}
                  w='80%'
                  color='whiteAlpha.800'
                  icon={<AiOutlineCaretDown />}
                  name='headingFont'
                  id='headingFont'
                >
                  {headingFonts.map(value => (
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
                    previewTheme.bodyFont
                      ? previewTheme.bodyFont
                      : 'Inknut Antiqua'
                  }
                  onChange={handleChange}
                  w='80%'
                  color='whiteAlpha.800'
                  icon={<AiOutlineCaretDown />}
                  name='bodyFont'
                  id='bodyFont'
                >
                  {bodyFonts.map(value => (
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
                    previewTheme.monoFont
                      ? previewTheme.monoFont
                      : 'Inknut Antiqua'
                  }
                  onChange={handleChange}
                  w='80%'
                  color='whiteAlpha.800'
                  icon={<AiOutlineCaretDown />}
                  name='monoFont'
                  id='monoFont'
                >
                  {monoFonts.map(value => (
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
                  <ImageUploadModal
                    ipfsHash={ipfsHash}
                    setIpfsHash={setIpfsHash}
                    setUploading={setUploading}
                    uploading={uploading}
                    matchMeta={previewTheme?.bgImg}
                    setLabel='Upload Background'
                    changeLabel='Change Background'
                  />
                  {ipfsHash || previewTheme?.bgImg ? (
                    <>
                      <Image
                        src={
                          themeImagePath(ipfsHash) ||
                          themeImagePath(previewTheme.bgImg)
                        }
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
            </Flex>
          </TabPanel>
          <TabPanel>
            {previewTheme?.daoMeta ? (
              <Flex direction='column' my={6}>
                <Flex justify='space-between' align='center'>
                  <TextBox size='xs' mb={3}>
                    Interface Words
                  </TextBox>
                  <Button variant='outline' onClick={resetWords}>
                    Reset
                  </Button>
                </Flex>

                {renderWordsFields()}
              </Flex>
            ) : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ContentBox>
  );
};

export default CustomThemeForm;
