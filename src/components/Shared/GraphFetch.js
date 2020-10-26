import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { PokemolContext } from '../../contexts/PokemolContext';
import Loading from '../Shared/Loading';
import { networkClients } from '../../utils/apollo/clients';

const GraphFetch = ({ query, setRecords, variables, suppressLoading }) => {
  const { state } = useContext(PokemolContext);

  const { loading, error, data, refetch } = useQuery(query, {
    client: networkClients[state.network.network_id],
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
