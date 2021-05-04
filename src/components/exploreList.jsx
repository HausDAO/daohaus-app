import React, { useContext, useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { ExploreContext } from '../contexts/ExploreContext';
import ExploreCard from './exploreCard';

const ExploreList = ({ handleDaoCalculate }) => {
  const [daos, setDaos] = useState([]);
  const { state, exploreDaos } = useContext(ExploreContext);

  useEffect(() => {
    const filteredAndSortedDaos = exploreDaos.data
      .filter(dao => {
        if (!dao.meta) {
          console.log('unregistered dao', dao);
          return false;
        }

        let searchMatch = true;
        if (state.searchTerm) {
          searchMatch =
            dao.meta.name.toLowerCase().indexOf(state.searchTerm) > -1;
        }

        let tagMatch = true;
        if (state.tags.length) {
          tagMatch =
            dao.meta?.tags.length &&
            state.tags.some(tag => dao.meta.tags.indexOf(tag) >= 0);
        }

        const memberCount =
          dao.members.length > (state.filters.members[0] || 0);
        const versionMatch = state.filters.version.includes(dao.version);
        const purposeMatch = state.filters.purpose.includes(dao.meta.purpose);
        const networkMatch = state.filters.network.includes(dao.networkId);

        return (
          searchMatch &&
          tagMatch &&
          memberCount &&
          versionMatch &&
          purposeMatch &&
          networkMatch
        );
      })
      .sort((a, b) => {
        if (state.sort.count) {
          return b[state.sort.value].length - a[state.sort.value].length;
        }
        return b[state.sort.value] - a[state.sort.value];
      });

    setDaos(filteredAndSortedDaos);
    handleDaoCalculate(filteredAndSortedDaos.length);
  }, [state.sort, state.filters, state.searchTerm, state.tags]);

  const daoList = daos.map((dao, i) => {
    return <ExploreCard dao={dao} key={`${dao.id}-${i}`} />;
  });

  return (
    <>
      {daos.length ? (
        <Flex wrap='wrap' align='start' justify='space-around' w='100%'>
          {daoList}
        </Flex>
      ) : null}
    </>
  );
};

export default ExploreList;
