import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useNetwork, useRefetchQuery } from '../../contexts/PokemolContext';
import {
  supergraphClients,
  statsgraphClients,
} from '../../utils/apollo/clients';

const GraphFetch = ({ query, setRecords, variables, entity, isStats }) => {
  const [network] = useNetwork();
  const [refetchQuery, updateRefetchQuery] = useRefetchQuery();

  const { loading, error, data, refetch } = useQuery(query, {
    client: isStats
      ? statsgraphClients[network.network_id]
      : supergraphClients[network.network_id],
    variables,
    fetchPolicy: 'network-only',
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
