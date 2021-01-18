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
    minion_factory_addr: '0x2A0D29d0a9e5DE91512805c3E2B58c1e95700dDa',
    moloch_factory_addr: '0x38064F40B20347d58b326E767791A6f79cdEddCe',
    dai_contract: '0x6b175474e89094c44da98b954eedeac495271d0f',
    weth_contract: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
    minion_factory_addr: '0x316eFCd421b0654B7aE8E806880D4AE88ecaE206',
    moloch_factory_addr: '0xC33a4EfecB11D2cAD8E7d8d2a6b5E7FEacCC521d',
    dai_contract: '0x8f2e097e79b1c51be9cba42658862f0192c3e487',
    weth_contract: '0xc778417e063141139fce010982780140aa0cd5ab',
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
    minion_factory_addr: '0x80ec2dB292E7a6D1D5bECB80e6479b2bE048AC98',
    moloch_factory_addr: '0x9c5d087f912e7187D9c75e90999b03FB31Ee17f5',
    dai_contract: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
    weth_contract: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
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
    minion_factory_addr: '0x9610389d548Ca0224aCaC40eB3241c5ED88D2479',
    moloch_factory_addr: '0x0F50B2F3165db96614fbB6E4262716acc9F9e098',
    wxdai_contract: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    safe_proxy_factory: '0x76E2cFc1F5Fa8F6a5b3fC4c8F4788F0116861F9B',
    safe_create_and_add_modules: '0xF61A721642B0c0C8b334bA3763BA1326F53798C0',
    safe_master_copy: '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F',
    module_enabler: '0x10286225AE73546Dcf1BB51F4695610Ae1EE5CaD',
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
