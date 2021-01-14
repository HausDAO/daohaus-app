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
        return dao.title.toLowerCase().indexOf(state.searchTerm) > -1;
      });
    } else {
      searchedDaos = state.allDaos;
    }

    const filteredDaos = searchedDaos.filter((dao) => {
      if (!dao.apiMetadata) {
        console.log('dao MISSING', dao);
        return false;
      }
      const memberCount = dao.members.length > (state.filters.members[0] || 0);
      const versionMatch = state.filters.versions.includes(dao.version);
      const purposeMatch = state.filters.purpose.includes(
        dao.apiMetadata.purpose,
      );
      return (
        !dao.apiMetadata.hide && memberCount && versionMatch && purposeMatch
      );
    });

    console.log('filteredDaos', filteredDaos);

    const sortedDaos = filteredDaos;

    // const sortedDaos = _.orderBy(
    //   filteredDaos,
    //   [
    //     'dao',
    //     (dao) => {
    //       if (state.sort.count) {
    //         return dao[state.sort.value].length;
    //       } else {
    //         if (state.sort.value2) {
    //           return dao[state.sort.value][state.sort.value2];
    //         } else {
    //           return dao[state.sort.value];
    //         }
    //       }
    //     },
    //   ],
    //   ['desc', 'desc'],
    // );

    setDaos(sortedDaos);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sort, state.filters, state.searchTerm]);

  const daoList = daos.map((dao) => {
    return (
      <div key={dao.id}>
        <Link
          to={dao.version === '2' ? `/dao/v2/${dao.id}` : `/dao/v1/${dao.id}`}
        >
          <ExploreCard dao={dao} />
        </Link>
      </div>
    );
  });

  return <div>{daos.length ? <div>{daoList}</div> : null}</div>;
};

export default ExploreList;
