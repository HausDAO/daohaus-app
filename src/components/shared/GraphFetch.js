import React, { useContext, useEffect } from 'react';
import ApolloClient from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import supportedChains from '../../utils/chains';
import { resolvers } from '../../utils/Resolvers';
import { PokemolContext } from '../../contexts/PokemolContext';
import Loading from '../shared/Loading';

// CAN UPDATE CLIENT HERE BASED ON NETWORK?
// needs to live outside the component so maybe just in it's own file?
const client = new ApolloClient({
  uri: supportedChains[42].subgraph_url,
  clientState: {
    resolvers,
  },
});

//paginated version

const GraphFetch = ({
  query,
  setRecords,
  variables,
  suppressLoading,
  // entity,
}) => {
  const { state } = useContext(PokemolContext);

  // const { loading, error, data, fetchMore, refetch } = useQuery(query, {
  const { loading, error, data } = useQuery(query, {
    // client: state.network === 'kovan' ? client : client,
    client,
    variables,
    // fetchPolicy: 'network-only',
    // pollInterval: 60000,
  });

  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       fetchMore({
  //         variables: { skip: data[entity].length },
  //         updateQuery: (prev, { fetchMoreResult }) => {
  //           if (!fetchMoreResult[entity].length) {
  //             return;
  //           }

  //           return Object.assign({}, prev, {
  //             members: [...prev[entity], ...fetchMoreResult[entity]],
  //           });
  //         },
  //       });
  //     } catch (err) {
  //       console.log('err', err);
  //     }
  //   };

  //   if (data) {
  //     fetch();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // useEffect(() => {
  //   if (state[entity].refetch) {
  //     refetch;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state]);

  if (loading) return <>{!suppressLoading ? <Loading /> : null}</>;
  if (error) return <></>;

  return <></>;
};

export default GraphFetch;
