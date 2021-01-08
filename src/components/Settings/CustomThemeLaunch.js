import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading } from '@chakra-ui/react';

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
    delete newTheme.brandImg;
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
        boosts: { ...daoMetadata, customTheme: newTheme },
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
          <Heading as='h4' size='sm' fontWeight='100'>
            Add a Custom Theme
          </Heading>
          <Box>
            The first upgrade available is a custom theme for your DAO. You must
            be a member to launch this boost.
          </Box>
          <Button type='submit' disabled={loading} onClick={handleLaunch}>
            Add Custom Theme
          </Button>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Heading as='h4' size='sm' fontWeight='100'>
            You can now customize your DAO’s theme!
          </Heading>
          <Box>This is the first of many upgrades coming.</Box>
          <Button as={RouterLink} to={`/dao/${dao.address}/settings/theme`}>
            Edit Custom Theme
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default CustomThemeLaunch;
