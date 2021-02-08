import React, { useState, useEffect } from 'react';
import { Flex, Box, Button, Icon, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { defaultTheme } from '../themes/defaultTheme';
import { boostPost } from '../utils/requests';
import CustomThemeForm from '../forms/customTheme';
import ThemePreview from '../components/themePreview';

const ThemeBuilder = () => {
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { theme, updateTheme, tempTheme, updateTempTheme } = useCustomTheme();
  const history = useHistory();
  const [previewTheme, setPreviewTheme] = useState();

  useEffect(() => {
    if (theme) {
      setPreviewTheme({
        primary500: theme.colors.primary[500],
        secondary500: theme.colors.secondary[500],
        bg500: theme.colors.background[500],
        bgImg: theme.images.bgImg,
        headingFont: theme.fonts.heading,
        bodyFont: theme.fonts.body,
        monoFont: theme.fonts.mono,
        daoMeta: theme.daoMeta,
      });
    }
  }, [theme]);

  const handleThemeUpdate = (update) => {
    const currentValues = tempTheme || defaultTheme;
    const themeUpdate = { ...currentValues, ...update };

    updateTempTheme(themeUpdate);
    updateTheme(themeUpdate);
  };

  const saveTheme = async () => {
    handleThemeUpdate(previewTheme);
    const currentValues = tempTheme || defaultTheme;
    const themeUpdate = { ...currentValues, ...previewTheme };

    const messageHash = injectedProvider.utils.sha3(daoid);
    const signature = await injectedProvider.eth.personal.sign(
      messageHash,
      address,
    );

    const updateThemeObject = {
      contractAddress: daoid,
      boostKey: 'customTheme',
      metadata: themeUpdate,
      network: injectedChain.network,
      signature,
    };

    const result = await boostPost('dao/boost', updateThemeObject);

    if (result === 'success') {
      // TODO: refresh daoMetaData?
      history.push(`/dao/${daochain}/${daoid}/settings`);
    } else {
      alert('error: forbidden');
    }
  };

  return (
    <Box>
      <Flex justify='space-between' align='center'>
        <Flex
          as={RouterLink}
          to={`/dao/${daochain}/${daoid}/settings`}
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
        {previewTheme ? (
          <>
            <Box w='30%'>
              <CustomThemeForm
                previewTheme={previewTheme}
                setPreviewTheme={setPreviewTheme}
                handleThemeUpdate={handleThemeUpdate}
              />
            </Box>

            <Box w='68%'>
              <ThemePreview
                previewValues={previewTheme}
                setPreviewTheme={setPreviewTheme}
              />
            </Box>
          </>
        ) : null}
      </Flex>
    </Box>
  );
};

export default ThemeBuilder;
