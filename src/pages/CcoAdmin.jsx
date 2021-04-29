import React, { useState, useEffect } from 'react';
import {
  Box, Flex, FormControl, Input, Button,
} from '@chakra-ui/react';

import { useParams } from 'react-router';
import MainViewLayout from '../components/mainViewLayout';
import { CCO_CONSTANTS } from '../utils/cco';
import { ccoPost } from '../utils/metadata';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import { useOverlay } from '../contexts/OverlayContext';

// TODO: do we need to check is cco amdin here or is this data ok to be public?

const CcoAdmin = React.memo(({
  daoMetaData,
  isCorrectNetwork,
}) => {
  console.log('daoMetaData', daoMetaData);
  const [ccoConfiguration, setCcoConfiguration] = useState({});
  const [loading, setLoading] = useState(false);
  const { daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { refreshDao } = useTX();
  const {
    errorToast,
    successToast,
  } = useOverlay();

  const isCco = daoMetaData?.boosts?.daosquare?.active;
  const onCcoNetwork = isCorrectNetwork && daoMetaData?.network === CCO_CONSTANTS.NETWORK;

  useEffect(() => {
    if (daoMetaData?.boosts?.daosquarecco) {
      setCcoConfiguration(daoMetaData.boosts.daosquarecco.metadata);
    }
  }, [daoMetaData]);

  const handleChange = (event) => {
    setCcoConfiguration({
      ...ccoConfiguration,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    console.log(ccoConfiguration);
    setLoading(true);

    if (!ccoConfiguration.ccoId) {
      ccoConfiguration.network = CCO_CONSTANTS.NETWORK;
    }

    try {
      const messageHash = injectedProvider.utils.sha3(daoid);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );

      const ccoUpdate = {
        contractAddress: daoid,
        boostKey: 'daosquarecco',
        metadata: ccoConfiguration,
        network: injectedChain.network,
        signature,
      };

      const result = await ccoPost('cco/meta', ccoUpdate);

      setLoading(false);

      if (result === 'success') {
        successToast({
          title: 'CCO Config Updated',
        });
        refreshDao();
      } else {
        errorToast({
          title: 'There was an error.',
        });
      }
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      errorToast({
        title: 'There was an error.',
      });
    }
  };

  const renderFields = () => {
    return CCO_CONSTANTS.METADATA_FIELDS.map((fieldName) => {
      return (
        <FormControl mb={4} key={fieldName}>
          <Box size='xs' mb={1}>
            {fieldName}
          </Box>
          <Input
            type='text'
            name={fieldName}
            onChange={handleChange}
            value={ccoConfiguration[fieldName]}
          />
        </FormControl>
      );
    });
  };

  return (
    <MainViewLayout header='DAOhaus CCO' isDao>
      <Box w='100%'>

        {onCcoNetwork && (
          <Flex wrap='wrap'>
            <Box
              w={['100%', null, null, null, '50%']}
              pr={[0, null, null, null, 6]}
              mb={6}
            >
              <Box fontSize='xl' mb={5}>CCO Config</Box>
              <Button mb={5} onClick={handleUpdate} disabled={loading}>Update Config</Button>
              {renderFields()}

            </Box>
            <Box w={['100%', null, null, null, '50%']}>
              poopin 2

            </Box>
          </Flex>
        )}
      </Box>
    </MainViewLayout>
  );
});

export default CcoAdmin;
