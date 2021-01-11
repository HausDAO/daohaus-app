import React, { useEffect, useState } from 'react';
import { Flex, List, ListItem } from '@chakra-ui/react';

import { useNetwork, useUser } from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import { getApiGnosis } from '../../utils/requests';
import { supportedChains } from '../../utils/chains';

const MinionSafe = () => {
  const [user] = useUser();
  const [network] = useNetwork();
  const [safes, setSafes] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!network || !user) {
      return;
    }
    const getSafes = async () => {
      setLoading(true);
      const networkName = supportedChains[network.network_id].short_name;
      const endpoint = `owners/${user.username}/`;
      const res = await getApiGnosis(networkName, endpoint);
      console.log(res);
      setSafes(res.safes);
      setLoading(false);
    };
    getSafes();
  }, [user, network]);

  return (
    <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
      <Flex>
        <TextBox>Gnosis Safes</TextBox>
      </Flex>
      {safes && safes.length ? (
        <List>
          {' '}
          {safes.map((safe) => (
            <ListItem key={safe}>{safe}</ListItem>
          ))}
        </List>
      ) : (
        <TextBox>{loading ? 'Loading... ' : 'No Safes'}</TextBox>
      )}
    </ContentBox>
  );
};

export default MinionSafe;
