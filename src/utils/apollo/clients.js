import ApolloClient from 'apollo-boost';

import supportedChains from '../chains';
import { resolvers } from './resolvers';

export const supergraphClients = {
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

export const statsgraphClients = {
  1: new ApolloClient({
    uri: supportedChains[1].stats_graph_url,
  }),
  4: new ApolloClient({
    uri: supportedChains[4].stats_graph_url,
  }),
  42: new ApolloClient({
    uri: supportedChains[42].stats_graph_url,
  }),
  100: new ApolloClient({
    uri: supportedChains[100].stats_graph_url,
  }),
};

export const boostsgraphClients = {
  1: new ApolloClient({
    uri: supportedChains[1].boosts_graph_url,
  }),
  4: new ApolloClient({
    uri: supportedChains[4].boosts_graph_url,
  }),
  42: new ApolloClient({
    uri: supportedChains[42].boosts_graph_url,
  }),
  100: new ApolloClient({
    uri: supportedChains[100].boosts_graph_url,
  }),
};
