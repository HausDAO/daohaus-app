import React, { useEffect, useState } from 'react';

import NetworkDaoList from './networkDaoList';

import { useUser } from '../contexts/UserContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from './ContentBox';
import {
  Accordion,
  AccordionItem,
  Box,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react';
import TextBox from './TextBox';

const NetworkList = () => {
  const { userHubDaos } = useUser();
  const { injectedProvider } = useInjectedProvider();
  const provider = injectedProvider?.currentProvider;
  const [searchTerm, setSearchTerm] = useState();
  const [sortedDaos, setSortedDaos] = useState({});

  useEffect(() => {
    const currentNetwork = userHubDaos.find(
      (dao) => dao.networkID === provider?.chainId,
    );
    const otherNetworks = userHubDaos
      .filter((dao) => dao.networkID !== provider?.chainId)
      .sort((a, b) =>
        a.networkID === '0x64' ? -1 : a.network_id - b.network_id,
      );
    const count = userHubDaos.reduce((sum, network) => {
      sum += network.data.length;
      return sum;
    }, 0);
    setSortedDaos({ currentNetwork, otherNetworks, count });
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <ContentBox p={6} mt={6} maxW='600px'>
      <Flex justify='space-between' alignItems='center' mb={6}>
        <TextBox size='xs'>
          Member of {sortedDaos?.count || 0} DAO{sortedDaos?.count > 1 && 's'}
        </TextBox>
        <Input
          type='search'
          className='input'
          placeholder='Search My Daos'
          maxW={300}
          onChange={(e) => handleChange(e)}
        />
      </Flex>
      {sortedDaos.currentNetwork && (
        <>
          <NetworkDaoList
            data={sortedDaos.currentNetwork.data}
            network={sortedDaos.currentNetwork}
            searchTerm={searchTerm}
          />
        </>
      )}
      {sortedDaos.otherNetworks?.length > 0 && (
        <>
          {sortedDaos.otherNetworks.map((network) => {
            if (network.data.length) {
              return (
                <NetworkDaoList
                  data={network.data}
                  network={network}
                  searchTerm={searchTerm}
                  key={network.network_id}
                />
              );
            } else {
              return null;
            }
          })}
        </>
      )}
    </ContentBox>
  );
};

export default NetworkList;
