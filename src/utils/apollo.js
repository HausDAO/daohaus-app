import ApolloClient from "apollo-boost";

export const createClient = (uri) => {
  return new ApolloClient({ uri });
};

export const apolloQuery = async ({ endpoint, query, variables }) => {
  try {
    const client = createClient(endpoint);
    const results = await client.query({
      query,
      variables,
    });
    return results.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const buildCrossChainQuery = (supportedChains, endpointType) => {
  let array = [];

  for (let chain in supportedChains) {
    array = [
      ...array,
      {
        name: supportedChains[chain].name,
        endpoint: supportedChains[chain][endpointType],
        networkID: chain,
      },
    ];
  }
  return array;
};

export const queryAllChains = async ({
  query,
  supportedChains,
  endpointType,
  reactSetter,
  variables,
}) => {
  buildCrossChainQuery(supportedChains, endpointType).forEach(async (chain) => {
    try {
      const chainData = await apolloQuery({
        endpoint: chain.endpoint,
        query,
        variables,
      });
      reactSetter((prevState) => [...prevState, { ...chain, data: chainData }]);
    } catch (error) {
      console.error(error);
    }
  });
};

export const multiFetch = async (fetchArray) => {
  fetchArray.forEach(
    async ({ endpoint, query, variables, resolvers, reactSetter }) => {
      try {
        const data = await apolloQuery({
          endpoint,
          query,
          variables,
          resolvers,
        });
        reactSetter(data);
      } catch (error) {
        console.error(error);
      }
    }
  );
};

// export const queryThenSetReact = async (
//   options,
//   setter,
//   loadingSetter = false
// ) => {
//   if (loadingSetter) {
//     loadingSetter(true);
//   }
//   try {
//     const data = await apolloQuery(options);
//     await setter(data);
//   } catch (error) {
//     console.error(error);
//     return error;
//   } finally {
//     if (loadingSetter) {
//       loadingSetter(false);
//     }
//   }
// };
