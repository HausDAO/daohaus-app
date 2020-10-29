import React, { useEffect, useState } from 'react';

import GraphFetch from '../components/Shared/GraphFetch';
import GraphFetchMore from '../components/Shared/GraphFetchMore';
import { HOME_DAO } from '../utils/apollo/dao-queries';
import { PROPOSALS_LIST } from '../utils/apollo/proposal-queries';
import { useDao, useProposals } from './PokemolContext';

const GraphInit = () => {
  const [fetch, setFetch] = useState();
  const [localDao, setLocalDao] = useState();
  const [localProposals, setLocalProposals] = useState();
  const [dao, updateDao] = useDao();
  const [, updateProposals] = useProposals();
  const { address } = dao || { address: null };

  useEffect(() => {
    console.log('firing address', address);
    setFetch(address);

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    console.log('firing localDao', localDao);
    if (localDao) {
      updateDao({ ...dao, graphData: localDao.moloch });
    }
    // eslint-disable-next-line
  }, [localDao]);

  useEffect(() => {
    console.log('firing localProposals', localProposals);
    if (localProposals) {
      updateProposals(localProposals);
    }
    // eslint-disable-next-line
  }, [localProposals]);

  return (
    <>
      {fetch ? (
        <>
          <GraphFetch
            query={HOME_DAO}
            setRecords={setLocalDao}
            entity='moloches'
            variables={{ contractAddr: address }}
          />

          <GraphFetchMore
            query={PROPOSALS_LIST}
            setRecords={setLocalProposals}
            entity='proposals'
            variables={{ contractAddr: address }}
            context={{ currentPeriod: dao?.currentPeriod }}
          />
        </>
      ) : null}
    </>
  );
};

export default GraphInit;
