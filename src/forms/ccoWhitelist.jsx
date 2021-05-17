import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import {
  Box,
  FormControl,
  Button,
  Textarea,
  Link,
  Flex,
} from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { CCO_CONSTANTS } from '../utils/cco';
import { ccoPost } from '../utils/metadata';

const CcoWhitelist = ({ daoMetaData, ccoType }) => {
  const [ccoWhitelistJson, setCcoWhitelistJson] = useState('');
  const [loading, setLoading] = useState(false);
  const { daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { errorToast, successToast } = useOverlay();
  let upload = useRef();

  const handleChange = event => {
    setCcoWhitelistJson(event.target.value);
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
        network: injectedChain.network,
        list: ccoWhitelistJson.replace(/(\r\n|\n|\r)/gm, ''),
        signature,
      };

      const result = await ccoPost(
        `cco/whitelist/${daoMetaData.boosts[ccoType].metadata.ccoId}`,
        ccoUpdate,
      );

      if (result === 'success') {
        successToast({
          title: 'CCO Whitelist uploaded',
        });
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

  const handleBrowse = () => {
    upload.value = null;
    upload.click();
  };

  const handleFileSet = async () => {
    const file = upload.files[0];
    const text = await file.text();

    console.log(text);
    setCcoWhitelistJson(text.replace(/(\r\n|\n|\r)/gm, ',\n'));
  };

  return (
    <Box mb={10} pb={5} borderBottomWidth={1}>
      <Box fontSize='xl' mb={5}>
        Address Whitelist
      </Box>
      <Box mb={5}>
        <Link
          isExternal
          href={`${CCO_CONSTANTS.WHITELIST_HOST}/${daoMetaData.boosts[ccoType].metadata.ccoId}.json`}
        >
          Check list here
        </Link>
      </Box>
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

      <Flex direction='column' width='30%'>
        <Button
          id='whitelist'
          variant='outline'
          onClick={() => {
            handleBrowse();
          }}
          mb={3}
        >
          Select file
        </Button>
        <input
          type='file'
          id='whitelist'
          accept='.csv'
          multiple={false}
          style={{ display: 'none' }}
          ref={ref => (upload = ref)}
          onChange={e => handleFileSet(e)}
        />
        <Button onClick={handleUpdate} isLoading={loading}>
          Update WhiteList
        </Button>
      </Flex>
    </Box>
  );
};

export default CcoWhitelist;
