import { Spinner } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';

import GraphFetch from '../../components/Shared/GraphFetch';
import { useDao } from '../../contexts/PokemolContext';
import { HOME_DAO } from '../../utils/apollo/dao-queries';

const Dao = () => {
  const [daoGraphData, setDaoGraphData] = useState();
  const [dao, updateDao] = useDao();

  useEffect(() => {
    if (daoGraphData) {
      // TODO: do updates in other spots override each other?
      updateDao({
        ...dao,
        graphData: daoGraphData.moloch,
      });
    }
  }, [daoGraphData]);

  return (
    <>
      {!dao ? (
        <Spinner />
      ) : (
        <div>
          {dao.graphData ? <p>hot dog</p> : null}

          <GraphFetch
            query={HOME_DAO}
            setRecords={setDaoGraphData}
            entity="moloches"
            variables={{ contractAddr: dao.address }}
          />
        </div>
      )}
    </>
  );
};

export default Dao;
