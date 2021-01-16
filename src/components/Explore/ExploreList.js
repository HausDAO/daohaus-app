import { Flex } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ExploreContext } from '../../contexts/ExploreContext';
import ExploreCard from './ExploreCard';

const ExploreList = () => {
  const [daos, setDaos] = useState([]);
  const { state } = useContext(ExploreContext);

  console.log('state', state);

  useEffect(() => {
    let searchedDaos;
    if (state.searchTerm) {
      searchedDaos = state.allDaos.filter((dao) => {
        if (!dao.apiMetadata) {
          console.log('unregistered dao', dao);
          return false;
        }

        return (
          dao.apiMetadata.name.toLowerCase().indexOf(state.searchTerm) > -1
        );
      });
    } else {
      searchedDaos = state.allDaos;
    }

    if (state.tags.length) {
      searchedDaos = searchedDaos.filter((dao) => {
        return (
          dao.apiMetadata.tags &&
          state.tags.some((tag) => dao.apiMetadata.tags.indexOf(tag) >= 0)
        );
      });
    }

    const filteredDaos = searchedDaos.filter((dao) => {
      if (!dao.apiMetadata) {
        return false;
      }
      const memberCount = dao.members.length > (state.filters.members[0] || 0);
      const versionMatch = state.filters.version.includes(dao.version);
      const purposeMatch = state.filters.purpose.includes(
        dao.apiMetadata.purpose,
      );
      const networkMatch = state.filters.network.includes(
        dao.apiMetadata.networkId,
      );
      return (
        !dao.apiMetadata.hide &&
        memberCount &&
        versionMatch &&
        purposeMatch &&
        networkMatch
      );
    });

    const sortedDaos = filteredDaos.sort((a, b) => {
      if (state.sort.count) {
        return b[state.sort.value].length - a[state.sort.value].length;
      } else {
        return b[state.sort.value] - a[state.sort.value];
      }
    });

    setDaos(sortedDaos);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sort, state.filters, state.searchTerm, state.tags]);

  const daoList = daos.map((dao) => {
    return (
      <div key={dao.id}>
        <ExploreCard dao={dao} />
      </div>
    );
  });

  return (
    <>
      {daos.length ? (
        <Flex wrap='wrap' align='center' justify='flex-start'>
          {daoList}
        </Flex>
      ) : null}
    </>
  );
};

export default ExploreList;
