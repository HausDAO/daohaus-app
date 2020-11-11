import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useNetwork, useRefetchQuery } from '../../contexts/PokemolContext';
import { networkClients } from '../../utils/apollo/clients';

const GraphFetchMore = ({ query, setRecords, variables, entity, context }) => {
  const [network] = useNetwork();
  const [fetched, setFetched] = useState();
  const [refetchQuery, updateRefetchQuery] = useRefetchQuery();

  const { loading, error, data, fetchMore, refetch } = useQuery(query, {
    client: networkClients[network.network_id],
    variables,
    fetchPolicy: 'network-only',
    context,
  });

  useEffect(() => {
    if (refetchQuery === entity) {
      setFetched(false);
      refetch();
      updateRefetchQuery(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchQuery]);

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
  }, [data, fetched]);

  useEffect(() => {
    if (data && fetched) {
      // console.log('setting entity', entity);
      setRecords(data[entity]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, data]);

  if (loading) return <></>;
  if (error) return <></>;

  return <></>;
};

export default GraphFetchMore;
