import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';

import AddressAvatar from './addressAvatar';
import TextBox from './TextBox';
import { UberHausMinionService } from '../services/uberHausMinionService';

//  For QA.
//  This won't be refactored until we know the specs of
//  UberHaus proposals.

const UberHausDelegate = ({ proposal }) => {
  const { daochain, daoid } = useParams();
  const [minionDelegate, setMinionDelegate] = useState(null);

  useEffect(() => {
    const getDelegate = async () => {
      try {
        const delegate = await UberHausMinionService({
          chainID: daochain,
          uberHausMinion: proposal?.minionAddress,
        })('currentDelegate')();
        setMinionDelegate(delegate);
      } catch (error) {
        console.error(error?.message);
      }
    };
    if (proposal?.minionAddress) {
      getDelegate();
    }
  }, [proposal]);

  return (
    <Box display='inline-block'>
      <Box
        as={Link}
        to={`/dao/${daochain}/${daoid}/profile/${minionDelegate}`}
        mt={6}
        flexDirection='column'
      >
        <TextBox size='xs' mb={2}>
          Current Delegate
        </TextBox>
        {minionDelegate ? <AddressAvatar addr={minionDelegate} /> : <Spinner />}
      </Box>
    </Box>
  );
};

export default UberHausDelegate;
