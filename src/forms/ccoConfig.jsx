import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, FormControl, Input, Button } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { CCO_CONSTANTS } from '../utils/cco';
import { ccoPost } from '../utils/metadata';

const CcoConfig = ({ daoMetaData, ccoType }) => {
  const [ccoConfiguration, setCcoConfiguration] = useState(
    CCO_CONSTANTS.METADATA_FIELDS,
  );
  const [loading, setLoading] = useState(false);
  const { daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { refetchMetaData } = useMetaData();
  const { errorToast, successToast } = useOverlay();

  useEffect(() => {
    if (daoMetaData?.boosts && daoMetaData.boosts[ccoType]) {
      setCcoConfiguration(daoMetaData.boosts[ccoType].metadata);
    }
  }, [daoMetaData]);

  const handleChange = event => {
    setCcoConfiguration({
      ...ccoConfiguration,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const messageHash = injectedProvider.utils.sha3(daoid);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );

      const ccoUpdate = {
        contractAddress: daoid,
        boostKey: ccoType,
        metadata: ccoConfiguration,
        network: injectedChain.network,
        signature,
      };

      // hardcoding new new cco boost configurations to daosquare types for now
      if (!ccoConfiguration.ccoId) {
        ccoUpdate.metadata.network = injectedChain.network;
        ccoUpdate.boostKey = 'daosquarecco';
      }

      const result = await ccoPost('cco/meta', ccoUpdate);

      if (result === 'success') {
        successToast({
          title: 'CCO Config Updated',
        });
        refetchMetaData();
      } else {
        errorToast({
          title: 'There was an error.',
        });
      }

      setLoading(false);
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      errorToast({
        title: 'There was an error.',
      });
    }
  };

  const renderFields = () => {
    return Object.keys(CCO_CONSTANTS.METADATA_FIELDS).map(fieldName => {
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
    <>
      <Box fontSize='xl' mb={5}>
        CCO Config
      </Box>
      {renderFields()}
      <Button mt={5} onClick={handleUpdate} isLoading={loading}>
        Update Config
      </Button>
    </>
  );
};

export default CcoConfig;
