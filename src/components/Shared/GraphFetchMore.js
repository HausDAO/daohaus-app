import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useNetwork } from '../../contexts/PokemolContext';
import Loading from '../Shared/Loading';
import { networkClients } from '../../utils/apollo/clients';

const GraphFetchMore = ({
  query,
  setRecords,
  variables,
  suppressLoading,
  entity,
  context,
}) => {
  const [network] = useNetwork();
  const [fetched, setFetched] = useState();

  const { loading, error, data, fetchMore, refetch } = useQuery(query, {
    client: networkClients[network.network_id],
    variables,
    fetchPolicy: 'network-only',
    context,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        fetchMore({
          variables: { skip: data[entity].length },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult[entity].length) {
              setFetched(true);
              return;
            }

            return Object.assign({}, prev, {
              [entity]: [...prev[entity], ...fetchMoreResult[entity]],
            });
          },
        });
      } catch (err) {
        console.log('err', err);
      }
    };

    if (data) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  console.log('error', error);

  useEffect(() => {
    console.log('data', data);
    if (data && fetched) {
      setRecords(data[entity]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, data]);

  // useEffect(() => {
  //   if (state[entity].refetch) {
  //     refetch();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state]);

  if (loading) return <>{!suppressLoading ? <Loading /> : null}</>;
  if (error) return <></>;

  return <></>;
};

export default GraphFetchMore;
