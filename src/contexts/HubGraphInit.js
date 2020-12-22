import React, { useEffect, useState } from 'react';

import GraphFetch from '../components/Shared/GraphFetch';
import { HUB_MEMBERSHIPS } from '../utils/apollo/member-queries';
import { supportedChains } from '../utils/chains';
import { useUser, useUserDaos } from './PokemolContext';

const HubGraphInit = ({ hubDaos, setHubDaos }) => {
  const [user] = useUser();
  const [userDaos, updateUserDaos] = useUserDaos();
  const [localUserDaos, setLocalUserDaos] = useState();

  const [daoFetch, setDaoFetch] = useState();

  useEffect(() => {
    console.log('user change', user);

    if (user) {
      setDaoFetch(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (localUserDaos) {
      // TODO: Potential dupes?

      // how does this play with member dao fetch in graphinit - we need this everywhere for that dao switcher modal
      // can we trigger that conditionally in graphinit?
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
                context={{ networkId: networkId }}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default HubGraphInit;
