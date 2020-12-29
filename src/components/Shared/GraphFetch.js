import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useNetwork, useRefetchQuery } from '../../contexts/PokemolContext';
import {
  supergraphClients,
  statsgraphClients,
  boostsgraphClients,
} from '../../utils/apollo/clients';

const GraphFetch = ({
  query,
  setRecords,
  variables,
  entity,
  context,
  isStats,
  isBoosts,
  networkOverride,
}) => {
  const [network] = useNetwork();
  const [refetchQuery, updateRefetchQuery] = useRefetchQuery();

  let client;
  if (networkOverride) {
    client = supergraphClients[networkOverride];
  } else if (isStats) {
    client = statsgraphClients[network.network_id];
  } else if (isBoosts) {
    client = boostsgraphClients[network.network_id];
  } else {
    client = supergraphClients[network.network_id];
  }

  const { loading, error, data, refetch } = useQuery(query, {
    client,
    variables,
    fetchPolicy: 'network-only',
    context,
  });

  useEffect(() => {
    if (refetchQuery === entity) {
      refetch();
      updateRefetchQuery(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchQuery]);

  useEffect(() => {
    if (data) {
      setRecords(data[entity]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (loading) return <></>;
  if (error) return <></>;

  return <></>;
};

export default GraphFetch;
