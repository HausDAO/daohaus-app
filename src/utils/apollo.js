import ApolloClient from 'apollo-boost';

export const createClient = uri => {
  return new ApolloClient({ uri });
};

export const graphQuery = async ({ endpoint, query, variables }) => {
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
