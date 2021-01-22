import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';

import {
  useDao,
  useUser,
  useWeb3Connect,
  useNetwork,
  useDaoMetadata,
} from '../../contexts/PokemolContext';
import { boostPost } from '../../utils/requests';
import CustomThemeLaunch from './CustomThemeLaunch';
import NewMinionForm from './NewMinionForm';
import NotificationsLaunch from './NotificationsLaunch';
// import { notificationBoostContent } from '../../content/boost-content';

const BoostLaunchWrapper = ({ boost }) => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();
  const [web3Connect] = useWeb3Connect();
  const [network] = useNetwork();

  const renderBoostBody = () => {
    switch (boost.key) {
      case 'customTheme': {
        return <CustomThemeLaunch />;
      }
      case 'vanillaMinion': {
        return <NewMinionForm />;
      }
      case 'notificationsLevel1': {
        return (
          <NotificationsLaunch handleLaunch={handleLaunch} loading={loading} />
        );
      }
    }
  };

  const handleLaunch = async (boostMetadata) => {
    setLoading(true);

    console.log('boostMetadata', boostMetadata);

    // const messageHash = web3Connect.web3.utils.sha3(dao.address);
    // const signature = await web3Connect.web3.eth.personal.sign(
    //   messageHash,
    //   user.username,
    // );

    // const updateThemeObject = {
    //   contractAddress: dao.address,
    //   boostKey: boost.key,
    //   metadata: boostMetadata,
    //   network: network.network,
    //   signature,
    // };

    // const result = await boostPost('dao/boost', updateThemeObject);

    // if (result === 'success') {
    //   updateDaoMetadata({
    //     ...daoMetadata,
    //     boosts: { ...daoMetadata, [boost.key]: boostMetadata },
    //   });
    //   setStep('success);
    // } else {
    //   alert('error: forbidden');
    // }

    // setLoading(false);
  };

  return <Box w='90%'>{renderBoostBody()}</Box>;
};

export default BoostLaunchWrapper;
