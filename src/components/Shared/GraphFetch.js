import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useNetwork } from '../../contexts/PokemolContext';
import Loading from '../Shared/Loading';
import { networkClients } from '../../utils/apollo/clients';

const GraphFetch = ({ query, setRecords, variables, suppressLoading }) => {
  const [network] = useNetwork();

  // const { loading, error, data, refetch } = useQuery(query, {
  const { loading, error, data } = useQuery(query, {
    client: networkClients[network.network_id],
    variables,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // TODO: how do we identify if this query needs refetch from state?
  // useEffect(() => {
  //   if (state.refetch) {
  //     refetch();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state]);

  if (loading) return <>{!suppressLoading ? <Loading /> : null}</>;
  if (error) return <></>;

  return <></>;
};

export default GraphFetch;
