export const supportedChains = {
  1: {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ETH',
    network: 'mainnet',
    network_id: 1,
    providers: ['walletconnect', 'portis', 'fortmatic'],
    rpc_url: 'https://mainnet.infura.io/',
    abi_api_url:
      'https://api.etherscan.io/api?module=contract&action=getabi&address=',
    metadata_api_url: 'https://data.daohaus.club',
    daohaus_url: 'https://daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
    token_list:
      'https://raw.githubusercontent.com/Uniswap/default-token-list/master/src/tokens/mainnet.json',
  },
  4: {
    name: 'Ethereum Rinkeby',
    short_name: 'rin',
    chain: 'ETH',
    network: 'rinkeby',
    network_id: 4,
    providers: ['walletconnect', 'portis', 'fortmatic'],
    rpc_url: 'https://rinkeby.infura.io/',
    abi_api_url:
      'https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=',
    metadata_api_url: 'https://data.daohaus.club',
    daohaus_url: 'https://rinkeby.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-rinkeby',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-rinkeby',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
  },
  42: {
    name: 'Ethereum Kovan',
    short_name: 'kov',
    chain: 'ETH',
    network: 'kovan',
    network_id: 42,
    providers: ['walletconnect', 'portis', 'fortmatic'],
    rpc_url: 'https://kovan.infura.io/',
    abi_api_url:
      'https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=',
    metadata_api_url: 'https://data.daohaus.club',
    daohaus_url: 'https://kovan.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-kovan',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-kovan',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
  },
  100: {
    name: 'xDAI Chain',
    short_name: 'xdai',
    chain: 'xDAI',
    network: 'xdai',
    network_id: 100,
    providers: ['walletconnect', 'portis'],
    rpc_url: 'https://dai.poa.network',
    abi_api_url:
      'https://blockscout.com/poa/xdai/api?module=contract&action=getabi&address=',
    metadata_api_url: 'https://data.daohaus.club',
    daohaus_url: 'https://xdai.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai',
    boosts_graph_url:
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

export function getChainDataByName(name) {
  const networkId = Object.keys(supportedChains).find((networkId) => {
    return supportedChains[networkId].network === name;
  });

  return supportedChains[networkId];
}
