import React, { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  // Button,
  // FormControl,
  // FormHelperText,
  // Heading,
  // Input,
  // Text,
} from '@chakra-ui/react';

import {
  useDao,
  useUser,
  useWeb3Connect,
  useNetwork,
  useDaoMetadata,
  useModals,
} from '../../contexts/PokemolContext';
import { boostPost } from '../../utils/requests';
import CustomThemeLaunch from './CustomThemeLaunch';
import NewMinionForm from './NewMinionForm';
import NotificationsLaunch from './NotificationsLaunch';
import { useHistory } from 'react-router-dom';
import DiscourseLaunch from './DiscourseLaunch';

const BoostLaunchWrapper = ({ boost }) => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();
  const [web3Connect] = useWeb3Connect();
  const [network] = useNetwork();
  const history = useHistory();
  const { closeModals } = useModals();

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
          <NotificationsLaunch
            handleLaunch={handleLaunch}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }
      case 'discourse': {
        return (
          <DiscourseLaunch
            handleLaunch={handleLaunch}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  const handleLaunch = async (boostMetadata) => {
    setLoading(true);

    console.log('boostMetadata', boostMetadata);

    const messageHash = web3Connect.web3.utils.sha3(dao.address);
    const signature = await web3Connect.web3.eth.personal.sign(
      messageHash,
      user.username,
    );

    const updateThemeObject = {
      contractAddress: dao.address,
      boostKey: boost.key,
      metadata: boostMetadata,
      network: network.network,
      signature,
    };

    console.log('updateThemeObject', updateThemeObject);

    const result = await boostPost('dao/boost', updateThemeObject);
    setLoading(false);

    if (result === 'success') {
      updateDaoMetadata({
        ...daoMetadata,
        boosts: {
          ...daoMetadata.boosts,
          [boost.key]: { active: true, metadata: boostMetadata },
        },
      });
      closeModals();

      // TODO: send to boost specific based on boostkey and give next steps.
      history.push(`/dao/${dao.address}/settings`);
    } else {
      alert('forbidden, are you an active dao member?');
    }
  };

  return <Box w='90%'>{renderBoostBody()}</Box>;
};

export default BoostLaunchWrapper;
