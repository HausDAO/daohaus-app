import React, { useEffect, useState } from 'react';

import GraphFetch from '../components/Shared/GraphFetch';
import GraphFetchMore from '../components/Shared/GraphFetchMore';
import { HOME_DAO } from '../utils/apollo/dao-queries';
import { MEMBERS_LIST } from '../utils/apollo/member-queries';
import { PROPOSALS_LIST } from '../utils/apollo/proposal-queries';
import { useDao, useMembers, useProposals } from './PokemolContext';

const GraphInit = () => {
  const [fetch, setFetch] = useState();
  const [localDao, setLocalDao] = useState();
  const [localProposals, setLocalProposals] = useState();
  const [localMembers, setLocalMembers] = useState();
  const [dao, updateDao] = useDao();
  const [, updateProposals] = useProposals();
  const [, updateMembers] = useMembers();
  const { address } = dao || { address: null };

  useEffect(() => {
    setFetch(address);

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    if (localDao) {
      updateDao({ ...dao, graphData: localDao.moloch });
    }
    // eslint-disable-next-line
  }, [localDao]);

  useEffect(() => {
    if (localProposals) {
      updateProposals(localProposals);
    }
    // eslint-disable-next-line
  }, [localProposals]);

  useEffect(() => {
    if (localMembers) {
      updateMembers(localMembers);
    }
    // eslint-disable-next-line
  }, [localMembers]);

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
          <GraphFetchMore
            query={MEMBERS_LIST}
            setRecords={setLocalMembers}
            entity='members'
            variables={{ contractAddr: address }}
          />
        </>
      ) : null}
    </>
  );
};

export default GraphInit;
