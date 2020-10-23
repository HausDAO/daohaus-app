import ApolloClient from 'apollo-boost';

import supportedChains from '../chains';
import { resolvers } from './resolvers';

export const networkClients = {
  1: new ApolloClient({
    uri: supportedChains[1].subgraph_url,
    clientState: {
      resolvers,
    },
  }),
  4: new ApolloClient({
    uri: supportedChains[4].subgraph_url,
    clientState: {
      resolvers,
    },
  }),
  42: new ApolloClient({
    uri: supportedChains[42].subgraph_url,
    clientState: {
      resolvers,
    },
  }),
  100: new ApolloClient({
    uri: supportedChains[100].subgraph_url,
    clientState: {
      resolvers,
    },
  }),
};
