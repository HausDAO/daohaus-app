import React, { useEffect, useState } from 'react';

import GraphFetch from '../components/Shared/GraphFetch';
import { HUB_MEMBERSHIPS } from '../utils/apollo/member-queries';
import { supportedChains } from '../utils/chains';
import { useUser, useUserDaos } from './PokemolContext';
import { getApiMetadata } from '../utils/requests';

const HubGraphInit = ({ hubDaos, setHubDaos }) => {
  const [user] = useUser();
  const [userDaos, updateUserDaos] = useUserDaos();
  const [localUserDaos, setLocalUserDaos] = useState();
  const [daoFetch, setDaoFetch] = useState();

  useEffect(() => {
    const fetchDaos = async () => {
      const mdRes = await getApiMetadata();
      setDaoFetch(mdRes);
    };

    if (user) {
      fetchDaos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (localUserDaos) {
      const currentHubDaos = hubDaos || [];
      const updatedHubDaos = [...currentHubDaos, ...localUserDaos];
      setHubDaos(updatedHubDaos);

      const currentUseDaos = userDaos || [];
      const updatedUserDaos = [
        ...currentUseDaos,
        ...localUserDaos.map((membership) => membership.moloch),
      ];
      updateUserDaos(updatedUserDaos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUserDaos]);

  return (
    <>
      {daoFetch ? (
        <>
          {Object.keys(supportedChains).map((networkId) => {
            return (
              <GraphFetch
                key={networkId}
                query={HUB_MEMBERSHIPS}
                setRecords={setLocalUserDaos}
                entity='membersHub'
                variables={{ memberAddress: user.username }}
                networkOverride={networkId}
                context={{ networkId: networkId, apiMetaDataJson: daoFetch }}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default HubGraphInit;
