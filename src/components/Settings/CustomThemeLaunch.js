import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading, Text } from '@chakra-ui/react';

import {
  useDao,
  useUser,
  useWeb3Connect,
  useNetwork,
  useDaoMetadata,
} from '../../contexts/PokemolContext';
import { defaultTheme } from '../../themes/theme-defaults';
import { boostPost } from '../../utils/requests';

const CustomThemeLaunch = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();
  const [web3Connect] = useWeb3Connect();
  const [network] = useNetwork();
  const [step, setStep] = useState(1);

  const handleLaunch = async () => {
    setLoading(true);

    const messageHash = web3Connect.web3.utils.sha3(dao.address);
    const signature = await web3Connect.web3.eth.personal.sign(
      messageHash,
      user.username,
    );

    const newTheme = defaultTheme;
    delete newTheme.bgImg;
    delete newTheme.avatarImg;
    const updateThemeObject = {
      contractAddress: dao.address,
      boostKey: 'customTheme',
      metadata: newTheme,
      network: network.network,
      signature,
    };

    const result = await boostPost('dao/boost', updateThemeObject);

    if (result === 'success') {
      updateDaoMetadata({
        ...daoMetadata,
        boosts: { ...daoMetadata.boosts, customTheme: newTheme },
      });
      setStep(2);
    } else {
      alert('error: forbidden');
    }

    setLoading(false);
  };

  return (
    <Box w='90%'>
      {step === 1 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Add a Custom Theme
          </Heading>
          <Text my={6}>
            The first upgrade available is a customizable theme for your DAO.
            You can change the look and feel as well the verbage used to fit
            your community's vibe. You must be a member to add this app.
          </Text>
          <Button type='submit' disabled={loading} onClick={handleLaunch}>
            Add Custom Theme
          </Button>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Custom Theme Added
          </Heading>
          <Text my={6}>
            You can now customize your theme of your DAO! You can edit these
            later in Settings > Custom Theme.
          </Text>
          <Button as={RouterLink} to={`/dao/${dao.address}/settings/theme`}>
            Edit Custom Theme
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default CustomThemeLaunch;
