import React, { useState, useEffect } from 'react';
import { Flex, Box, Button, Icon, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import { useTempTheme, useTheme } from '../../contexts/CustomThemeContext';
import { defaultTheme } from '../../themes/theme-defaults';
import { useDao } from '../../contexts/PokemolContext';
import { boostPost } from '../../utils/requests';
import ThemeColorsForm from '../../components/Forms/CustomThemeForm';
import ThemePreview from '../../components/Settings/ThemePreview';

const CustomTheme = () => {
  const [dao] = useDao();
  const [theme, setTheme] = useTheme();
  const history = useHistory();
  const [tempTheme, setTempTheme] = useTempTheme();
  const [previewTheme, setPreviewTheme] = useState({
    primary500: theme.colors.primary[500],
    secondary500: theme.colors.secondary[500],
    background500: theme.colors.background[500],
    brandImg: theme.images.brandImg,
    bgImg: theme.images.bgImg,
    primaryFont: theme.fonts.heading,
    bodyFont: theme.fonts.body,
    monoFont: theme.fonts.mono,
  });

  const handleThemeUpdate = (update) => {
    const currentValues = tempTheme || defaultTheme;
    const themeUpdate = { ...currentValues, ...update };
    setTempTheme(themeUpdate);
    setTheme(themeUpdate);
  };

  const saveTheme = async () => {
    const updateThemeObject = {
      contractAddress: dao.address,
      boostKey: 'customTheme',
      metadata: tempTheme,
    };
    const result = await boostPost('dao/boost', updateThemeObject);
    console.log(result);
    history.push(`/dao/${dao.address}/settings`);
  };

  // SET DEFAULT THEME PREVIEW
  useEffect(() => {
    if (tempTheme) {
      setPreviewTheme(tempTheme);
    }
  }, [tempTheme]);
  console.log(theme);
  return (
    <Box>
      <Flex ml={6} justify='space-between' align='center'>
        <Flex
          as={RouterLink}
          to={`/dao/${dao.address}/settings`}
          align='center'
        >
          <Icon as={BiArrowBack} color='secondary.500' mr={2} />
          Back
        </Flex>
        <HStack spacing='10px' mr='4%'>
          <Button variant='outline'>Use an NFT</Button>
          <Button
            variant='outline'
            onClick={() => handleThemeUpdate(previewTheme)}
          >
            Full Screen Preview
          </Button>
          <Button onClick={saveTheme}>Save Changes</Button>
        </HStack>
      </Flex>
      <Flex>
        <Box w='30%'>
          <ThemeColorsForm
            previewTheme={previewTheme}
            setPreviewTheme={setPreviewTheme}
            // handlePreviewUpdate={handlePreviewUpdate}
            handleThemeUpdate={handleThemeUpdate}
          />
        </Box>

        <Box w='68%'>
          <ThemePreview
            previewValues={previewTheme}
            setPreviewTheme={setPreviewTheme}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default CustomTheme;
