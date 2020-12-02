import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import GraphFetch from '../components/Shared/GraphFetch';
import GraphFetchMore from '../components/Shared/GraphFetchMore';
import { BANK_BALANCES } from '../utils/apollo/bank-queries';
import { DAO_ACTIVITIES, HOME_DAO } from '../utils/apollo/dao-queries';
import { MEMBERS_LIST, USER_MEMBERSHIPS } from '../utils/apollo/member-queries';
import { PROPOSALS_LIST } from '../utils/apollo/proposal-queries';
import { validDaoParams } from '../utils/helpers';
import {
  useMembers,
  useProposals,
  useUser,
  useUserDaos,
  useDaoMetadata,
  useDaoGraphData,
  useBalances,
  useActivities,
} from './PokemolContext';

const GraphInit = () => {
  const location = useLocation();
  const [user] = useUser();
  const [daoMetadata] = useDaoMetadata();
  const [, updateUserDaos] = useUserDaos();
  const [localUserDaos, setLocalUserDaos] = useState();
  const [, updateProposals] = useProposals();
  const [localProposals, setLocalProposals] = useState();
  const [, updateMembers] = useMembers();
  const [localMembers, setLocalMembers] = useState();
  const [, updateBalances] = useBalances();
  const [localBalances, setLocalBalances] = useState();
  const [, updateActivities] = useActivities();
  const [localActivities, setLocalActivities] = useState();
  const [, updateDaoGraphData] = useDaoGraphData();
  const [localDao, setLocalDao] = useState();
  const [daoFetch, setDaoFetch] = useState();

  const { address } = daoMetadata || { address: null };

  useEffect(() => {
    const validParam = validDaoParams(location);
    setDaoFetch(validParam && address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoMetadata, location]);

  useEffect(() => {
    if (localDao) {
      updateDaoGraphData(localDao);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDao]);

  useEffect(() => {
    if (localProposals) {
      updateProposals(localProposals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localProposals]);

  useEffect(() => {
    if (localMembers) {
      updateMembers(localMembers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localMembers]);

  useEffect(() => {
    if (localBalances) {
      updateBalances(localBalances);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localBalances]);

  useEffect(() => {
    if (localActivities) {
      updateActivities(localActivities);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localActivities]);

  useEffect(() => {
    if (localUserDaos) {
      updateUserDaos(localUserDaos.map((membership) => membership.moloch));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUserDaos]);

  return (
    <>
      {daoFetch ? (
        <>
          <GraphFetch
            query={HOME_DAO}
            setRecords={setLocalDao}
            entity='moloch'
            variables={{ contractAddr: daoMetadata.address }}
          />
          <GraphFetchMore
            query={PROPOSALS_LIST}
            setRecords={setLocalProposals}
            entity='proposals'
            variables={{ contractAddr: daoMetadata.address }}
          />
          <GraphFetchMore
            query={MEMBERS_LIST}
            setRecords={setLocalMembers}
            entity='daoMembers'
            variables={{ contractAddr: daoMetadata.address }}
          />
          <GraphFetchMore
            query={BANK_BALANCES}
            setRecords={setLocalBalances}
            entity='balances'
            variables={{
              molochAddress: daoMetadata.address,
            }}
            isStats={true}
          />
          <GraphFetch
            query={DAO_ACTIVITIES}
            setRecords={setLocalActivities}
            entity='moloch'
            variables={{ contractAddr: daoMetadata.address }}
          />
        </>
      ) : null}
      {user && user.username ? (
        <GraphFetch
          query={USER_MEMBERSHIPS}
          setRecords={setLocalUserDaos}
          entity='members'
          variables={{ memberAddress: user.username }}
        />
      ) : null}
    </>
  );
};

export default GraphInit;
