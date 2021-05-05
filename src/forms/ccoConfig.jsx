import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Box,
  FormControl,
  Input,
  Button,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';

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

  const handleBotChange = e => {
    setCcoConfiguration({
      ...ccoConfiguration,
      bot: e,
    });
  };

  const handleUpdate = async newCcoType => {
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
        ccoUpdate.boostKey = newCcoType;
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

  const renderTextAreas = () => {
    return Object.keys(CCO_CONSTANTS.METADATA_TEXTAREA_FIELDS).map(
      fieldName => {
        return (
          <FormControl mb={4} key={fieldName}>
            <Box size='xs' mb={1}>
              {fieldName}
            </Box>
            <Textarea
              name={fieldName}
              onChange={handleChange}
              value={ccoConfiguration[fieldName]}
            />
          </FormControl>
        );
      },
    );
  };

  return (
    <>
      <Box fontSize='xl' mb={5}>
        CCO Config
      </Box>
      {renderFields()}
      {renderTextAreas()}

      <Box mb={5}>Bot (must be a member of the dao)</Box>
      <RadioGroup onChange={handleBotChange} value={ccoConfiguration.bot}>
        <Stack direction='column'>
          {CCO_CONSTANTS.BOTS.map(bot => {
            return (
              <Radio value={bot} key={bot}>
                {bot}
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>

      {!ccoConfiguration.ccoId ? (
        <>
          <Button
            mt={5}
            mr={5}
            onClick={() => handleUpdate('cco')}
            isLoading={loading}
          >
            Create CCO
          </Button>
          <Button
            mt={5}
            onClick={() => handleUpdate('daosquarecco')}
            isLoading={loading}
          >
            Create Daosqaure CCO
          </Button>
        </>
      ) : (
        <Button mt={5} onClick={() => handleUpdate()} isLoading={loading}>
          Update
        </Button>
      )}
    </>
  );
};

export default CcoConfig;
