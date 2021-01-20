import React, { useEffect, useState } from 'react';

import GraphFetchMore from '../components/Shared/GraphFetchMore';
import { EXPLORER_DAOS } from '../utils/apollo/explore-queries';
import { supportedChains } from '../utils/chains';
import { getApiMetadata, getApiPriceData } from '../utils/requests';

const ExploreGraphInit = ({ daos, setDaos, setFetchComplete }) => {
  const [localDaos, setLocalDaos] = useState();
  const [daoFetch, setDaoFetch] = useState();
  const [networkFetchCount, setNetworkFetchCount] = useState(0);

  useEffect(() => {
    const fetchDaos = async () => {
      const mdRes = await getApiMetadata();
      const priceRes = await getApiPriceData();
      setDaoFetch({ meta: mdRes, prices: priceRes });
    };

    fetchDaos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localDaos) {
      const currentDaos = daos || [];
      const updatedDaos = [...currentDaos, ...localDaos];
      setDaos(updatedDaos);
      setNetworkFetchCount(networkFetchCount + 1);

      if (Object.keys(supportedChains).length === networkFetchCount + 1) {
        setFetchComplete(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDaos]);

  return (
    <>
      {daoFetch ? (
        <>
          {Object.keys(supportedChains).map((networkId) => {
            return (
              <GraphFetchMore
                key={networkId}
                query={EXPLORER_DAOS}
                setRecords={setLocalDaos}
                entity='moloches'
                networkOverride={networkId}
                context={{
                  networkId: networkId,
                  apiMetaDataJson: daoFetch.meta,
                  priceDataJson: daoFetch.prices,
                }}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default ExploreGraphInit;
