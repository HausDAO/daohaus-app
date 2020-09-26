export const supportedChains = {
  1: {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ETH',
    network: 'mainnet',
    chain_id: 1,
    network_id: 1,
    rpc_url: 'https://mainnet.infura.io/',
    api_url: 'https://luizh7qidl.execute-api.us-east-1.amazonaws.com/prod',
    daohaus_url: 'https://daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus',
    transmutation_subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
  },
  4: {
    name: 'Ethereum Rinkeby',
    short_name: 'rin',
    chain: 'ETH',
    network: 'rinkeby',
    chain_id: 4,
    network_id: 4,
    rpc_url: 'https://rinkeby.infura.io/',
    api_url: 'https://e5sk5e8me2.execute-api.us-east-1.amazonaws.com/rinkeby',
    daohaus_url: 'https://rinkeby.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-rinkeby',
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
    rpc_url: 'https://kovan.infura.io/',
    api_url: 'https://kp7w1od8kd.execute-api.us-east-1.amazonaws.com/kovan',
    daohaus_url: 'https://kovan.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-kovan',
    transmutation_subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
  },
  74: {
    name: 'IDChain',
    short_name: 'idchain',
    chain: 'EIDI',
    network: 'idchain',
    chain_id: 74,
    network_id: 74,
    rpc_url: 'https://explorer.idchain.one/rpcgraph',
    api_url: 'https://vncmvrainc.execute-api.us-east-1.amazonaws.com/idchain',
    daohaus_url: 'https://idchain.daohaus.club',
    subgraph_url:
      'https://subgraph.idchain.daohaus.club/subgraphs/name/odyssy-automaton/daohaus-idchain',
    transmutation_subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
  },
  100: {
    name: 'xDAI Chain',
    short_name: 'xdai',
    chain: 'xDAI',
    network: 'mainnet',
    chain_id: 100,
    network_id: 1,
    rpc_url: 'https://dai.poa.network',
    api_url: 'https://fbpzfkbqyi.execute-api.us-east-1.amazonaws.com/xdai',
    daohaus_url: 'https://kovanxdai.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai',
    transmutation_subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation-xdai',
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
