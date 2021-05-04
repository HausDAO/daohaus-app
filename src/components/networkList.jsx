import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Icon, Input } from '@chakra-ui/react';
import { BsFillCircleFill } from 'react-icons/bs';

import NetworkDaoList from './networkDaoList';
import { useUser } from '../contexts/UserContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

const NetworkList = () => {
  const { userHubDaos } = useUser();
  const [searchTerm, setSearchTerm] = useState();
  const [sortedDaos, setSortedDaos] = useState({});

  useEffect(() => {
    const networkDaos = userHubDaos.sort((a, b) => {
      return a.hubSortOrder - b.hubSortOrder;
    });
    const count = userHubDaos.reduce((sum, network) => {
      sum += network.data.length;
      return sum;
    }, 0);
    setSortedDaos({ networkDaos, count });
  }, [userHubDaos]);

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  return (
    <ContentBox p={6} mt={6} maxW='600px'>
      {sortedDaos.count ? (
        <Flex justify='space-between' alignItems='center' mb={6}>
          <TextBox size='xs'>
            {`Member of ${sortedDaos.count || 0} DAO`}
            {sortedDaos.count > 1 && 's'}
          </TextBox>
          <Input
            type='search'
            className='input'
            placeholder='Search My Daos'
            maxW={300}
            onChange={e => handleChange(e)}
          />
        </Flex>
      ) : (
        <>
          <TextBox size='sm'>You aren’t a member in any DAOs</TextBox>
          <Flex justify='flex-start' alignItems='center' my={10}>
            <Icon boxSize={10} as={BsFillCircleFill} color='grey' mr={5} />
            <TextBox size='sm'>your DAOs will show here</TextBox>
          </Flex>
          <TextBox as={RouterLink} to='/explore'>
            Explore DAOs
          </TextBox>
        </>
      )}
      {sortedDaos.networkDaos?.length > 0 && (
        <>
          {sortedDaos.networkDaos.map((network, i) => {
            if (network.data.length) {
              return (
                <NetworkDaoList
                  data={network.data}
                  network={network}
                  searchTerm={searchTerm}
                  key={network.network_id}
                  index={i}
                />
              );
            }
            return null;
          })}
        </>
      )}
    </ContentBox>
  );
};

export default NetworkList;
