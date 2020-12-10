export const supportedChains = {
  1: {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ETH',
    network: 'mainnet',
    chain_id: 1,
    network_id: 1,
    providers: ['walletconnect', 'portis', 'fortmatic'],
    rpc_url: 'https://mainnet.infura.io/',
    api_url: 'https://luizh7qidl.execute-api.us-east-1.amazonaws.com/prod',
    // api_url: process.env.REACT_APP_PROD_API,
    metadata_api_url: 'https://data.daohaus.club',
    daohaus_url: 'https://daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats',
    transmutation_subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
    token_list:
      'https://raw.githubusercontent.com/Uniswap/default-token-list/master/src/tokens/mainnet.json',
  },
  4: {
    name: 'Ethereum Rinkeby',
    short_name: 'rin',
    chain: 'ETH',
    network: 'rinkeby',
    chain_id: 4,
    network_id: 4,
    providers: ['walletconnect', 'portis', 'fortmatic'],
    rpc_url: 'https://rinkeby.infura.io/',
    api_url: 'https://e5sk5e8me2.execute-api.us-east-1.amazonaws.com/rinkeby',
    metadata_api_url: 'https://data.daohaus.club',
    daohaus_url: 'https://rinkeby.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-rinkeby',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-rinkeby',
    transmutation_subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
  },
  42: {
    name: 'Ethereum Kovan',
    short_name: 'kov',
    chain: 'ETH',
    network: 'kovan',
    chain_id: 42,
    network_id: 42,
    providers: ['walletconnect', 'portis', 'fortmatic'],
    rpc_url: 'https://kovan.infura.io/',
    api_url: 'https://kp7w1od8kd.execute-api.us-east-1.amazonaws.com/kovan',
    metadata_api_url: 'https://data.daohaus.club',
    daohaus_url: 'https://kovan.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-kovan',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-kovan',
    transmutation_subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
  },
  100: {
    name: 'xDAI Chain',
    short_name: 'xdai',
    chain: 'xDAI',
    network: 'xdai',
    chain_id: 100,
    network_id: 100,
    providers: ['walletconnect', 'portis'],
    rpc_url: 'https://dai.poa.network',
    api_url: 'https://fbpzfkbqyi.execute-api.us-east-1.amazonaws.com/xdai',
    metadata_api_url: 'https://data.daohaus.club',
    daohaus_url: 'https://xdai.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai',
    transmutation_subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation-xdai',
    token_list: 'http://tokens.honeyswap.org/',
  },
};

export function getChainData(chainId) {
  const chainData = supportedChains[+chainId];

  if (!chainData) {
    throw new Error('ChainId missing or not supported');
  }

  const API_KEY = process.env.REACT_APP_INFURA_PROJECT_ID;

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}

export default supportedChains;
