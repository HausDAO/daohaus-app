import React, { useEffect, useState } from 'react';
import { Button, Flex, List, ListIcon, ListItem } from '@chakra-ui/react';
import { utils } from 'web3';

import { useDao, useNetwork, useUser } from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import { getApiGnosis } from '../../utils/requests';
import { supportedChains } from '../../utils/chains';
import { MdCheckCircle } from 'react-icons/md';

const MinionSafe = () => {
  const [user] = useUser();
  const [network] = useNetwork();
  const [dao] = useDao();
  const [safes, setSafes] = useState();
  const [safesDetails, setSafesDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!network || !user || !dao?.graphData?.minions) {
      return;
    }
    const minions = dao.graphData.minions;
    console.log(minions);
    const getUserSafes = async () => {
      setLoading(true);
      const promises = [];
      const networkName = supportedChains[network.network_id].short_name;
      const endpoint = `owners/${user.username}/`;
      const res = promises.push(getApiGnosis(networkName, endpoint));
      console.log(res);
      // this is going to have problems with more than one minion
      const minionEndpoint = `owners/${utils.toChecksumAddress(
        minions[0].minionAddress,
      )}/`;
      promises.push(getApiGnosis(networkName, minionEndpoint));
      const responses = await Promise.all(promises);
      const intersection = responses[0].safes.filter((element) =>
        responses[1].safes.includes(element),
      );
      setSafes(intersection);
    };
    console.log('get');
    getUserSafes();
  }, [user, network, dao?.graphData?.minions]);

  useEffect(() => {
    if (!network || !safes) {
      return;
    }
    const getSafesDetails = async () => {
      setLoading(true);
      const networkName = supportedChains[network.network_id].short_name;
      const promises = [];
      safes.forEach((safe) => {
        const endpoint = `safes/${safe}/`;
        const res = getApiGnosis(networkName, endpoint);
        promises.push(res);
      });
      const allSafes = await Promise.all(promises);
      console.log(allSafes);

      setSafesDetails(allSafes);
      setLoading(false);
    };
    getSafesDetails();
  }, [safes, network]);

  return (
    <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
      <Flex>
        <TextBox>Gnosis Safes</TextBox>
      </Flex>
      {safes && safes.length ? (
        <List>
          {' '}
          {safesDetails.map((safe) => (
            <ListItem key={safe.address}>
              <TextBox>
                {safe.address}
                <Button>Finish Setup</Button>
              </TextBox>
              <List>
                {safe.owners.map((owner) => (
                  <ListItem key={owner}>
                    <ListIcon as={MdCheckCircle} color='green.500' /> {owner}
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      ) : (
        <TextBox>{loading ? 'Loading... ' : 'No Safes'}</TextBox>
      )}
    </ContentBox>
  );
};

export default MinionSafe;
