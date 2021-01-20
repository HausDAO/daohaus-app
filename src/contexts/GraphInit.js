import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import GraphFetch from '../components/Shared/GraphFetch';
import GraphFetchMore from '../components/Shared/GraphFetchMore';
import { BANK_BALANCES } from '../utils/apollo/bank-queries';
import { DAO_ACTIVITIES, HOME_DAO } from '../utils/apollo/dao-queries';
import { MEMBERS_LIST, USER_MEMBERSHIPS } from '../utils/apollo/member-queries';
import { PROPOSALS_LIST } from '../utils/apollo/proposal-queries';
import { supportedChains } from '../utils/chains';
import { validDaoParams } from '../utils/helpers';
import { getApiMetadata } from '../utils/requests';
import {
  useMembers,
  useProposals,
  useUser,
  useUserDaos,
  useDaoMetadata,
  useDaoGraphData,
  useBalances,
  useActivities,
  useNetwork,
} from './PokemolContext';

const GraphInit = () => {
  const location = useLocation();
  const [network] = useNetwork();
  const [user] = useUser();
  const [daoMetadata] = useDaoMetadata();
  const [userDaos, updateUserDaos] = useUserDaos();
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
  const [userDaoFetch, setUserDaoFetch] = useState();

  const { address } = daoMetadata || { address: null };

  useEffect(() => {
    const validParam = validDaoParams(location);
    setDaoFetch(validParam && address && network);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoMetadata, location, network]);

  useEffect(() => {
    const fetchDaoMeta = async () => {
      const mdRes = await getApiMetadata();
      setUserDaoFetch(mdRes);
    };

    if (user && network) {
      fetchDaoMeta();
    }
  }, [user, network]);

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
      const currentUseDaos = userDaos || [];
      const updatedUserDaos = [
        ...currentUseDaos,
        ...localUserDaos.map((membership) => {
          return { ...membership.moloch, hubSort: membership.hubSort };
        }),
      ];

      updateUserDaos(updatedUserDaos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUserDaos]);

  return (
    <>
      {daoFetch && address ? (
        <>
          <GraphFetch
            query={HOME_DAO}
            setRecords={setLocalDao}
            entity='moloch'
            context={{ network }}
            variables={{ contractAddr: address }}
          />
          <GraphFetchMore
            query={PROPOSALS_LIST}
            setRecords={setLocalProposals}
            entity='proposals'
            variables={{ contractAddr: address }}
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
          <GraphFetch
            query={DAO_ACTIVITIES}
            setRecords={setLocalActivities}
            entity='moloch'
            variables={{ contractAddr: address }}
          />
        </>
      ) : null}
      {user && network && userDaoFetch ? (
        <>
          {Object.keys(supportedChains).map((networkId) => {
            return (
              <GraphFetch
                key={networkId}
                query={USER_MEMBERSHIPS}
                setRecords={setLocalUserDaos}
                entity='members'
                variables={{ memberAddress: user.username }}
                networkOverride={networkId}
                context={{
                  networkId: networkId,
                  apiMetaDataJson: userDaoFetch,
                }}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default GraphInit;
