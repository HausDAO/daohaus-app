import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { PokemolContext } from '../../contexts/PokemolContext';
import Loading from '../shared/Loading';
import { networkClients } from '../../utils/apollo/clients';

const GraphFetchMore = ({
  query,
  setRecords,
  variables,
  suppressLoading,
  entity,
}) => {
  const { state } = useContext(PokemolContext);

  const { loading, error, data, fetchMore, refetch } = useQuery(query, {
    client: networkClients[state.network.network_id],
    variables,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        fetchMore({
          variables: { skip: data[entity].length },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult[entity].length) {
              return;
            }

            return Object.assign({}, prev, {
              members: [...prev[entity], ...fetchMoreResult[entity]],
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

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
