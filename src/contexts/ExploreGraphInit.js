import React, { useEffect, useState } from 'react';

import GraphFetch from '../components/Shared/GraphFetch';
import { EXPLORER_DAOS } from '../utils/apollo/dao-queries';
import { supportedChains } from '../utils/chains';
import { getApiMetadata } from '../utils/requests';

const ExploreGraphInit = ({ daos, setDaos }) => {
  const [localDaos, setLocalDaos] = useState();
  const [daoFetch, setDaoFetch] = useState();

  useEffect(() => {
    const fetchDaos = async () => {
      const mdRes = await getApiMetadata();
      setDaoFetch(mdRes);
    };

    fetchDaos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localDaos) {
      const currentDaos = daos || [];
      const updatedDaos = [...currentDaos, ...localDaos];
      setDaos(updatedDaos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDaos]);

  return (
    <>
      {daoFetch ? (
        <>
          {Object.keys(supportedChains).map((networkId) => {
            return (
              <GraphFetch
                key={networkId}
                query={EXPLORER_DAOS}
                setRecords={setLocalDaos}
                entity='moloches'
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

export default ExploreGraphInit;
