import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import GraphFetch from '../components/Shared/GraphFetch';
import GraphFetchMore from '../components/Shared/GraphFetchMore';
import { HOME_DAO } from '../utils/apollo/dao-queries';
import { MEMBERS_LIST, USER_MEMBERSHIPS } from '../utils/apollo/member-queries';
import { PROPOSALS_LIST } from '../utils/apollo/proposal-queries';
import {
  useMembers,
  useProposals,
  useUser,
  useUserDaos,
  useDaoMetadata,
  useDaoGraphData,
} from './PokemolContext';

const GraphInit = () => {
  const location = useLocation();
  const [fetch, setFetch] = useState();
  const [localDao, setLocalDao] = useState();
  const [localProposals, setLocalProposals] = useState();
  const [localMembers, setLocalMembers] = useState();
  const [localUserDaos, setLocalUserDaos] = useState();
  const [, updateDaoGraphData] = useDaoGraphData();
  const [daoMetadata] = useDaoMetadata();
  const [, updateUserDaos] = useUserDaos();
  const [user] = useUser();
  const [, updateProposals] = useProposals();
  const [, updateMembers] = useMembers();
  const { address } = daoMetadata || { address: null };

  useEffect(() => {
    var pathname = location.pathname.split('/');
    const daoParam = pathname[2];
    const regex = RegExp('0x[0-9a-f]{10,40}');
    const validParam =
      pathname[1] === 'dao' && regex.test(daoParam) ? daoParam : false;

    setFetch(validParam && address);
    // eslint-disable-next-line
  }, [address, location]);

  useEffect(() => {
    if (localDao) {
      updateDaoGraphData(localDao);
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

  useEffect(() => {
    if (localUserDaos) {
      updateUserDaos(localUserDaos.map((membership) => membership.moloch));
    }
    // eslint-disable-next-line
  }, [localUserDaos]);

  return (
    <>
      {fetch ? (
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
