import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import GraphFetch from '../components/Shared/GraphFetch';
import GraphFetchMore from '../components/Shared/GraphFetchMore';
import { BANK_BALANCES } from '../utils/apollo/bank-queries';
import { HOME_DAO } from '../utils/apollo/dao-queries';
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
  const [, updateDaoGraphData] = useDaoGraphData();
  const [localDao, setLocalDao] = useState();
  const [daoFetch, setDaoFetch] = useState();

  const { address } = daoMetadata || { address: null };

  useEffect(() => {
    const validParam = validDaoParams(location);
    setDaoFetch(validParam && address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, location]);

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
      console.log('localBalances', localBalances);
      updateBalances(localBalances);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localBalances]);

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
            variables={{ contractAddr: address }}
          />
          <GraphFetchMore
            query={PROPOSALS_LIST}
            setRecords={setLocalProposals}
            entity='proposals'
            variables={{ contractAddr: address }}
            context={{ currentPeriod: daoMetadata.currentPeriod }}
          />
          <GraphFetchMore
            query={MEMBERS_LIST}
            setRecords={setLocalMembers}
            entity='daoMembers'
            variables={{ contractAddr: address }}
          />
          <GraphFetchMore
            query={BANK_BALANCES}
            setRecords={setLocalBalances}
            entity='balances'
            variables={{
              molochAddress: address,
            }}
            isStats={true}
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
