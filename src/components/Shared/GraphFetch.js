import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useNetwork, useRefetchQuery } from '../../contexts/PokemolContext';
import { networkClients } from '../../utils/apollo/clients';

const GraphFetch = ({ query, setRecords, variables, entity }) => {
  const [network] = useNetwork();
  const [refetchQuery, updateRefetchQuery] = useRefetchQuery();

  const { loading, error, data, refetch } = useQuery(query, {
    client: networkClients[network.network_id],
    variables,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (refetchQuery === entity) {
      refetch();
      updateRefetchQuery(null);
    }
  }, [refetchQuery]);

  useEffect(() => {
    if (data) {
      console.log('setting single fetch entity', entity);
      setRecords(data[entity]);
    }
  }, [data]);

  if (loading) return <></>;
  if (error) return <></>;

  return <></>;
};

export default GraphFetch;
