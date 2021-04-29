import React, { useState } from 'react';
import {
  Box, FormControl, Button, Textarea, Link,
} from '@chakra-ui/react';

import { useParams } from 'react-router';
import { CCO_CONSTANTS } from '../utils/cco';
import { ccoPost } from '../utils/metadata';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import { useOverlay } from '../contexts/OverlayContext';

const CcoWhitelist = ({ daoMetaData }) => {
  const [ccoWhitelistJson, setCcoWhitelistJson] = useState('');
  const [loading, setLoading] = useState(false);
  const { daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { refreshDao } = useTX();
  const {
    errorToast,
    successToast,
  } = useOverlay();

  const handleChange = (event) => {
    setCcoWhitelistJson(event.target.value.replace(/(\r\n|\n|\r)/gm, ''));
  };

  console.log('ccoWhitelistJson', ccoWhitelistJson);
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
        boostKey: 'daosquarecco',
        network: injectedChain.network,
        list: ccoWhitelistJson,
        signature,
      };

      const result = await ccoPost(`cco/whitelist/${daoMetaData.boosts.daosquarecco.metadata.ccoId}`, ccoUpdate);

      setLoading(false);

      if (result === 'success') {
        successToast({
          title: 'CCO Whitelist uploaded',
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

  return (
    <>
      <Box fontSize='xl' mb={5}>Address Whitelist</Box>
      <Box mb={5}>
        <Link isExternal href={`${CCO_CONSTANTS.WHITELIST_HOST}/${daoMetaData.boosts.daosquarecco.metadata.ccoId}.json`}>
          Check list here
        </Link>
      </Box>

      <Button mb={5} onClick={handleUpdate} disabled={loading}>Update WhiteList</Button>
      <FormControl mb={4}>
        <Box size='xs' mb={1}>
          New Whitelist JSON
        </Box>
        <Textarea
          type='text'
          name='whitelist'
          onChange={handleChange}
          value={ccoWhitelistJson}
        />
      </FormControl>
    </>
  );
};

export default CcoWhitelist;
