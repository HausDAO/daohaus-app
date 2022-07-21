import { Button, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ipfsJsonPin, ipfsPrePost } from '../utils/metadata';
import GenericTextarea from './genericTextArea';
import ModButton from './modButton';

const GoofyCustomField = props => {
  const { localForm, name } = props;
  const [hasPinned, setHasPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const { watch, setValue } = localForm;
  const { daoid } = useParams();

  const fieldText = watch(name);
  const ipfs = watch(`ipfshash-${name}`);

  const handlePin = async () => {
    setLoading(true);
    try {
      const key = await ipfsPrePost('dao/ipfs-key', {
        daoAddress: daoid,
      });

      if (fieldText && typeof fieldText === 'string') {
        const data = { fieldText };
        const pinataData = await ipfsJsonPin(key, data);
        if (pinataData?.IpfsHash) {
          setValue(`ipfshash-${name}`, pinataData.IpfsHash);
        }
      }
      setHasPinned(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('ipfs', ipfs);
  }, [ipfs]);

  return (
    <>
      <GenericTextarea {...props} btn={<ModButton text='Pin' />} />
      <Button onClick={handlePin} disabled={hasPinned}>
        {loading ? <Spinner /> : 'Pin'}
      </Button>
    </>
  );
};

export default GoofyCustomField;
