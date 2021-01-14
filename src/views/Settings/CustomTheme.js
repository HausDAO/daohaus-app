import React, { useState, useEffect } from 'react';
import { Flex, Box, Button, Icon, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { BiArrowBack } from 'react-icons/bi';

import { useTempTheme, useTheme } from '../../contexts/CustomThemeContext';
import { defaultTheme } from '../../themes/theme-defaults';
import {
  useDao,
  useNetwork,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { boostPost } from '../../utils/requests';
import CustomThemeForm from '../../components/Forms/CustomThemeForm';
import ThemePreview from '../../components/Settings/ThemePreview';

const CustomTheme = () => {
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();
  const [dao] = useDao();
  const [theme, setTheme] = useTheme();
  const history = useHistory();
  const [tempTheme, setTempTheme] = useTempTheme();
  const [network] = useNetwork();
  const [previewTheme, setPreviewTheme] = useState();

  useEffect(() => {
    if (theme) {
      setPreviewTheme({
        primary500: theme.colors.primary[500],
        secondary500: theme.colors.secondary[500],
        bg500: theme.colors.background[500],
        bgImg: theme.images.bgImg,
        primaryFont: theme.fonts.heading,
        bodyFont: theme.fonts.body,
        monoFont: theme.fonts.mono,
        daoMeta: theme.daoMeta,
      });
    }
  }, [theme]);

  const handleThemeUpdate = (update) => {
    const currentValues = tempTheme || defaultTheme;
    const themeUpdate = { ...currentValues, ...update };

    setTempTheme(themeUpdate);
    setTheme(themeUpdate);
  };

  const saveTheme = async () => {
    handleThemeUpdate(previewTheme);
    const currentValues = tempTheme || defaultTheme;
    const themeUpdate = { ...currentValues, ...previewTheme };

    console.log('themeUpdate', themeUpdate);

    const messageHash = web3Connect.web3.utils.sha3(dao.address);
    const signature = await web3Connect.web3.eth.personal.sign(
      messageHash,
      user.username,
    );

    const updateThemeObject = {
      contractAddress: dao.address,
      boostKey: 'customTheme',
      metadata: themeUpdate,
      network: network.network,
      signature,
    };

    const result = await boostPost('dao/boost', updateThemeObject);

    if (result === 'success') {
      history.push(`/dao/${dao.address}/settings`);
    } else {
      alert('error: forbidden');
    }
  };

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

export default CustomTheme;
