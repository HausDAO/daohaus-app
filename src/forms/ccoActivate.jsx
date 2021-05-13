import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Button } from '@chakra-ui/react';

import { useMetaData } from '../contexts/MetaDataContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { ccoPost } from '../utils/metadata';

const CcoActivate = ({ daoMetaData, ccoType }) => {
  const [loading, setLoading] = useState(false);
  const { daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { refetchMetaData } = useMetaData();
  const { errorToast, successToast } = useOverlay();

  const isActive = daoMetaData.boosts[ccoType].active;

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
        active: !daoMetaData.boosts[ccoType].active,
        metadata: daoMetaData.boosts[ccoType].metadata,
        signature,
      };

      const result = await ccoPost('cco/meta', ccoUpdate);

      setLoading(false);

      if (result === 'success') {
        successToast({
          title: 'CCO status uploaded',
        });

        console.log('refreshing');
        refetchMetaData();
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
      <Button
        mb={5}
        size='lg'
        onClick={handleUpdate}
        isLoading={loading}
        backgroundColor='red.500'
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </Button>
    </>
  );
};

export default CcoActivate;
