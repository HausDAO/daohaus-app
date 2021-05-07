export const supportedChains = {
  '0x1': {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ETH',
    nativeCurrency: 'ETH',
    network: 'mainnet',
    network_id: 1,
    chain_id: '0x1',
    hub_sort_order: 1,
    providers: ['walletconnect'],
    // , 'portis', 'fortmatic'
    rpc_url: `https://${process.env.REACT_APP_RPC_URI}.eth.rpc.rivet.cloud/`,
    abi_api_url:
      'https://api.etherscan.io/api?module=contract&action=getabi&address=',
    tokenlist_api_url:
      'https://api.etherscan.io/api?module=account&action=tokennfttx&address=',
    metadata_api_url: 'https://data.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
    minion_factory_addr: '0x88207Daf515e0da1A32399b3f92D128B1BF45294',
    moloch_factory_addr: '0x38064F40B20347d58b326E767791A6f79cdEddCe',
    dai_contract: '0x6b175474e89094c44da98b954eedeac495271d0f',
    wrapper_contract: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wrap_n_zap_factory_addr: '0x',
    block_explorer: 'https://etherscan.io',
  },
  '0x4': {
    name: 'Ethereum Rinkeby',
    short_name: 'rin',
    chain: 'ETH',
    nativeCurrency: 'ETH',
    network: 'rinkeby',
    network_id: 4,
    chain_id: '0x4',
    hub_sort_order: 6,
    providers: ['walletconnect'],
    // , 'portis', 'fortmatic'
    rpc_url: `https://${process.env.REACT_APP_RPC_URI}.rinkeby.rpc.rivet.cloud/`,
    abi_api_url:
      'https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=',
    tokenlist_api_url:
      'https://api-rinkeby.etherscan.io/api?module=account&action=tokennfttx&address=',
    metadata_api_url: 'https://data.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-rinkeby',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-rinkeby',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-boosts-rinkeby',
    minion_factory_addr: '0x313F02A44089150C9ff7011D4e87b52404A914A9',
    moloch_factory_addr: '0xC33a4EfecB11D2cAD8E7d8d2a6b5E7FEacCC521d',
    dai_contract: '0x8f2e097e79b1c51be9cba42658862f0192c3e487',
    wrapper_contract: '0xc778417e063141139fce010982780140aa0cd5ab',
    wrap_n_zap_factory_addr: '0x4e521FF388c83b4c945a33984ba42Efb73Cc04e6',
    block_explorer: 'https://rinkeby.etherscan.io',
    superfluid: {
      minion_factory_addr: '0x4b168c1a1E729F4c8e3ae81d09F02d350fc905ca',
      resolver: '0x659635Fab0A0cef1293f7eb3c7934542B6A6B31A',
      subgraph_url:
        'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-rinkeby',
      superapp_addr: {
        v1: '0x7d8151FAB5D6742F1c574fff472B6794062C2D0C',
      },
      version: 'v1',
    },
  },
  '0x2a': {
    name: 'Ethereum Kovan',
    short_name: 'kov',
    chain: 'ETH',
    nativeCurrency: 'ETH',
    network: 'kovan',
    network_id: 42,
    chain_id: '0x2a',
    hub_sort_order: 5,
    providers: ['walletconnect'],
    // , 'portis', 'fortmatic'
    rpc_url: `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    abi_api_url:
      'https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=',
    tokenlist_api_url:
      'https://api-kovan.etherscan.io/api?module=account&action=tokennfttx&address=',
    metadata_api_url: 'https://data.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-kovan',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-kovan',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-boosts-kovan',
    minion_factory_addr: '0xCE63803E265617c55567a7A7b584fF2dbD76210B',
    uberhaus_minion_factory_addr: '0x03042577463E3820F9cA6Ca3906BAad599ba9382',
    moloch_factory_addr: '0x9c5d087f912e7187D9c75e90999b03FB31Ee17f5',
    dai_contract: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    wrapper_contract: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
    wrap_n_zap_factory_addr: '0xbf9e327d465A4A160fA7805282Fb8C7aB892770a',
    block_explorer: 'https://kovan.etherscan.io',
  },
  '0x64': {
    name: 'xDAI Chain',
    short_name: 'xdai',
    chain: 'xDAI',
    nativeCurrency: 'xDai',
    network: 'xdai',
    network_id: 100,
    chain_id: '0x64',
    hub_sort_order: 2,
    providers: ['walletconnect'],
    rpc_url: 'https://dai.poa.network',
    abi_api_url:
      'https://blockscout.com/xdai/mainnet/api?module=contract&action=getabi&address=',
    tokenlist_api_url:
      'https://blockscout.com/xdai/mainnet/api?module=account&action=tokenlist&address=',
    metadata_api_url: 'https://data.daohaus.club',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-boosts-xdai',
    minion_factory_addr: '0x53508D981439Ce6A3283597a4775F6f23504d4A2',
    moloch_factory_addr: '0x0F50B2F3165db96614fbB6E4262716acc9F9e098',
    wrapper_contract: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    wrap_n_zap_factory_addr: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
    block_explorer: 'https://blockscout.com/poa/xdai',
    uberhaus_minion_factory_addr: '0xf5106077892992B84c33C35CA8763895eb80B298',
    superfluid: {
      minion_factory_addr: '0xfC86DfDd3b2e560729c78b51dF200384cfe87438',
      resolver: '0xD2009765189164b495c110D61e4D301729079911',
      subgraph_url:
        'https://thegraph.com/explorer/subgraph/superfluid-finance/superfluid-xdai',
      superapp_addr: {
        v1: '0x9fc9420F277b7C25E17B67008b35CCB01c5c9B63',
      },
      version: 'v1',
    },
  },
  '0x89': {
    name: 'Matic',
    short_name: 'matic',
    chain: 'MATIC',
    nativeCurrency: 'MATIC',
    network: 'matic',
    network_id: 137,
    chain_id: '0x89',
    hub_sort_order: 3,
    providers: ['walletconnect'],
    rpc_url: 'https://rpc-mainnet.maticvigil.com',
    metadata_api_url: 'https://data.daohaus.club',
    abi_api_url: 'https://mainnet.maticvigil.com/api/swagger/',
    tokenlist_api_url:
      'https://mainnet.maticvigil.com/api/swagger?module=account&action=tokenlist&address=',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-matic',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-matic',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-boosts-matic',
    minion_factory_addr: '0x02e458B5eEF8f23e78AefaC0F15f5d294C3762e9',
    moloch_factory_addr: '0x6690C139564144b27ebABA71F9126611a23A31C9',
    dai_contract: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    wrapper_contract: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    wrap_n_zap_factory_addr: '0xbf9e327d465A4A160fA7805282Fb8C7aB892770a',
    block_explorer: 'https://explorer-mainnet.maticvigil.com',
    superfluid: {
      minion_factory_addr: '0x52acf023d38A31f7e7bC92cCe5E68d36cC9752d6',
      resolver: '0xE0cc76334405EE8b39213E620587d815967af39C',
      subgraph_url:
        'https://thegraph.com/explorer/subgraph/superfluid-finance/superfluid-matic',
      superapp_addr: {
        v1: '0xdb4D89F2199b9Cf451B7Ff4bdC94b1c96De4bdD0',
      },
      version: 'v1',
    },
  },
  '0x4a': {
    name: 'IDChain',
    short_name: 'idchain',
    chain: 'IDChain',
    nativeCurrency: 'EIDI',
    network: 'idchain',
    network_id: 74,
    chain_id: '0x4a',
    hub_sort_order: 4,
    providers: ['walletconnect'],
    rpc_url: 'https://idchain.one/rpc/',
    metadata_api_url: 'https://data.daohaus.club',
    abi_api_url:
      'https://explorer.idchain.one/api?module=contract&action=getabi&address=',
    subgraph_url:
      'https://graph.idchain.one/subgraphs/name/idchain/daohaus-supergraph',
    stats_graph_url:
      'https://graph.idchain.one/subgraphs/name/idchain/daohaus-stats',
    boosts_graph_url: '',
    minion_factory_addr: '0x90253955D4066eE27C183B4644089a5A04A888F1',
    moloch_factory_addr: '0x99B4525D6d6F6c3161D0abd6A58B482f46ad5Cd0',
    dai_contract: '0xE1A400f340bf4eeDbc4Bbb553f1BFf7Ec4656E3e',
    wrapper_contract: '0x2b309226500ADc5956a422950A2AD6E6333Bb315',
    wrap_n_zap_factory_addr: '0x',
    block_explorer: 'https://explorer.idchain.one',
  },
};

export const chainByID = chainID => supportedChains[chainID];
export const getGraphEndpoint = (chainID, endpointType) =>
  chainByID(chainID)[endpointType];

export const chainByNetworkId = networkId => {
  const idMapping = {
    1: supportedChains['0x1'],
    4: supportedChains['0x4'],
    42: supportedChains['0x2a'],
    74: supportedChains['0x4a'],
    100: supportedChains['0x64'],
    137: supportedChains['0x89'],
  };

  return idMapping[networkId];
};

export const chainByName = networkName => {
  const networkKey = Object.keys(supportedChains).find(chainId => {
    return supportedChains[chainId].network === networkName;
  });

  return supportedChains[networkKey];
};

export const MM_ADDCHAIN_DATA = {
  '0x89': {
    chainId: '0x89',
    chainName: 'Matic Mainnet',
    rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
    blockExplorerUrls: ['https://explorer.matic.network/'],
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  '0x64': {
    chainId: '0x64',
    chainName: 'xDai',
    rpcUrls: ['https://dai.poa.network'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
    nativeCurrency: {
      name: 'xDai',
      symbol: 'XDAI',
      decimals: 18,
    },
  },
  '0x4a': {
    chainId: '0x4a',
    chainName: 'IDchain',
    rpcUrls: ['https://idchain.one/rpc/'],
    blockExplorerUrls: ['https://explorer.idchain.one'],
    nativeCurrency: {
      name: 'eidi',
      symbol: 'EIDI',
      decimals: 18,
    },
  },
};

export const EIP3085 = {
  SUPPORTED: {
    '0x64': true,
    '0x89': true,
    '0x4a': true,
  },
  NOT_SUPPORTED: {
    '0x1': true,
    '0x2a': true,
    '0x4': true,
  },
};
