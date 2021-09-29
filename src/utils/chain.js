export const supportedChains = {
  '0x1': {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
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
    tokenlist_api_url: 'https://api.etherscan.io/api',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-boosts',
    minion_factory_addr: '0x88207Daf515e0da1A32399b3f92D128B1BF45294',
    moloch_factory_addr: '0x38064F40B20347d58b326E767791A6f79cdEddCe',
    dai_contract: '0x6b175474e89094c44da98b954eedeac495271d0f',
    wrapper_contract: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wrap_n_zap_factory_addr: '0x4e521FF388c83b4c945a33984ba42Efb73Cc04e6',
    block_explorer: 'https://etherscan.io',
    rarible: {
      api_url: 'https://ethereum-api.rarible.org/protocol/v0.1/ethereum',
      nft_transfer_proxy: '0x0',
      base_url: 'https://rarible.com',
    },
    niftyMinion: {
      minion_factory_addr: '0x7EDfBDED3077Bc035eFcEA1835359736Fa342209',
      version: 'v1',
    },
    safeMinion: {
      minion_factory_addr: '0xbC37509A283E2bb67fd151c34E72e826C501E108',
      safe_mutisend_addr: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      safe_sign_lib_addr: '0xa25b3579a295be016de5eb5F082b54B12d45F72C',
    },
  },
  '0x4': {
    name: 'Ethereum Rinkeby',
    short_name: 'rinkeby',
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
    tokenlist_api_url: 'https://api-rinkeby.etherscan.io/api',
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
    safeMinion: {
      minion_factory_addr: '0x3f13ABc8931c0e381Ce6d1Be9f978aE6E9d99Cb8',
      safe_mutisend_addr: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      safe_sign_lib_addr: '0xa25b3579a295be016de5eb5F082b54B12d45F72C',
    },
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
    rarible: {
      api_url:
        // 'https://ethereum-api-staging.rarible.org/protocol/v0.1/ethereum',
        'https://api-staging.rarible.com/protocol/v0.1/ethereum',
      nft_transfer_proxy: '0x7d47126a2600E22eab9eD6CF0e515678727779A6',
      base_url: 'https://rinkeby.rarible.com',
    },
    dao_conditional_helper_addr: '0xc50462aEa8873f6343a2Fd2103aE1dD21d53bC27',
  },
  '0x2a': {
    name: 'Ethereum Kovan',
    short_name: 'kovan',
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
    tokenlist_api_url: 'https://api-kovan.etherscan.io/api',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-kovan',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-kovan',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-boosts-kovan',
    minion_factory_addr: '0xCE63803E265617c55567a7A7b584fF2dbD76210B',
    uberhaus_minion_factory_addr: '0x03042577463E3820F9cA6Ca3906BAad599ba9382',
    transmutation_factory_addr: '0xbca622291fFe797C77a8Bc6D000584b22877e971',
    moloch_factory_addr: '0x9c5d087f912e7187D9c75e90999b03FB31Ee17f5',
    dai_contract: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    wrapper_contract: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
    wrap_n_zap_factory_addr: '0xbf9e327d465A4A160fA7805282Fb8C7aB892770a',
    block_explorer: 'https://kovan.etherscan.io',
    safeMinion: {
      minion_factory_addr: '0xA1b97D22e22507498B350A9edeA85c44bA7DBC01',
      safe_mutisend_addr: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      safe_sign_lib_addr: '0xa25b3579a295be016de5eb5F082b54B12d45F72C',
    },
  },
  '0x64': {
    name: 'xDAI Chain',
    short_name: 'xdai',
    nativeCurrency: 'xDai',
    network: 'xdai',
    network_id: 100,
    chain_id: '0x64',
    hub_sort_order: 2,
    providers: ['walletconnect'],
    rpc_url: 'https://dai.poa.network',
    abi_api_url:
      'https://blockscout.com/xdai/mainnet/api?module=contract&action=getabi&address=',
    tokenlist_api_url: 'https://blockscout.com/xdai/mainnet/api',
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
    safeMinion: {
      minion_factory_addr: '0xA1b97D22e22507498B350A9edeA85c44bA7DBC01',
      safe_mutisend_addr: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      safe_sign_lib_addr: '0xa25b3579a295be016de5eb5F082b54B12d45F72C',
    },
    uberhaus_minion_factory_addr: '0xf5106077892992B84c33C35CA8763895eb80B298',
    transmutation_factory_addr: '0x7F94ec015665743fE84A7f59297eD86A0470e069',
    superfluid: {
      minion_factory_addr: '0xfC86DfDd3b2e560729c78b51dF200384cfe87438',
      resolver: '0xD2009765189164b495c110D61e4D301729079911',
      subgraph_url:
        'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-xdai',
      superapp_addr: {
        v1: '0x9fc9420F277b7C25E17B67008b35CCB01c5c9B63',
      },
      version: 'v1',
    },
    niftyMinion: {
      minion_factory_addr: '0xA6B75C3EBfA5a5F801F634812ABCb6Fd7055fd6d',
      version: 'v1',
    },
    neapolitanMinion: {
      minion_factory_addr: '0xA6B75C3EBfA5a5F801F634812ABCb6Fd7055fd6d',
      version: 'v1',
    },
  },
  '0x89': {
    name: 'Matic',
    short_name: 'matic',
    nativeCurrency: 'MATIC',
    network: 'matic',
    network_id: 137,
    chain_id: '0x89',
    hub_sort_order: 3,
    providers: ['walletconnect'],
    rpc_url: 'https://rpc-mainnet.maticvigil.com/',
    abi_api_url:
      'https://api.polygonscan.com/api?module=contract&action=getabi&address=',
    tokenlist_api_url: 'https://api.polygonscan.com/api',
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
    block_explorer: 'https://polygonscan.com',
    safeMinion: {
      minion_factory_addr: '0xA1b97D22e22507498B350A9edeA85c44bA7DBC01',
      safe_mutisend_addr: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      safe_sign_lib_addr: '0xa25b3579a295be016de5eb5F082b54B12d45F72C',
    },
    superfluid: {
      minion_factory_addr: '0x52acf023d38A31f7e7bC92cCe5E68d36cC9752d6',
      resolver: '0xE0cc76334405EE8b39213E620587d815967af39C',
      subgraph_url:
        'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-matic',
      superapp_addr: {
        v1: '0xdb4D89F2199b9Cf451B7Ff4bdC94b1c96De4bdD0',
      },
      version: 'v1',
    },
    niftyMinion: {
      minion_factory_addr: '0x4CCaDF3f5734436B28869c27A11B6D0F4776bc8E',
      version: 'v1',
    },
  },
  '0x6357d2e0': {
    name: 'Harmony Testnet',
    short_name: 'harmony',
    nativeCurrency: 'ONE',
    network: 'harmonyTest',
    network_id: 1666700000,
    chain_id: '0x6357d2e0',
    hub_sort_order: 3,
    providers: ['walletconnect'],
    rpc_url: 'https://api.s0.b.hmny.io',
    abi_api_url: 'https://ctrver.t.hmny.io/fetchContractCode?contractAddress=',
    tokenlist_api_url: 'https://api.polygonscan.com/api',
    subgraph_url: 'http://localhost:8000/subgraphs/name/victaphu/daohaus',
    stats_graph_url:
      'http://localhost:8000/subgraphs/name/victaphu/daohaus-stats',
    boosts_graph_url:
      'http://127.0.0.1:8000/subgraphs/name/victaphu/daohaus-boosts',
    minion_factory_addr: '0xF1D62573deDbE7CBED757C2043861b2293D3184a',
    moloch_factory_addr: '0x5F099659FA596c95B06Db8457748068F11F20AdE',
    wrapper_contract: '0x421ffdD8C67133cA6961E05DAE223Fd52cebD340',
    wrap_n_zap_factory_addr: '0xBc899838daE0d6563489D8dc7E90510eBb2BDcaf',
    dai_contract: '0x373E636F40875803DF77Bd72425E95B00764F2ab',
    block_explorer: 'https://explorer.pops.one',
    niftyMinion: {
      minion_factory_addr: '0xD26b63F4668577f02317D9C1FC6B5bD5d5c29C2d',
      version: 'v1',
    },
  },
  '0xa4b1': {
    name: 'Arbitrum',
    short_name: 'arb1',
    nativeCurrency: 'ETH',
    network: 'arbitrum',
    network_id: 42161,
    chain_id: '0xa4b1',
    hub_sort_order: 3,
    providers: ['walletconnect'],
    rpc_url: 'https://arb1.arbitrum.io/rpc',
    abi_api_url:
      'https://api.arbiscan.io/api?module=contract&action=getabi&address=',
    tokenlist_api_url: 'https://api.arbiscan.io/api',
    subgraph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-arbitrum',
    stats_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-arbitrum',
    boosts_graph_url:
      'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-boosts-arbitrum',
    minion_factory_addr: '',
    moloch_factory_addr: '0x9232dea84e91b49fef6b604eea0455692fc27ba8',
    dai_contract: '',
    wrapper_contract: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    wrap_n_zap_factory_addr: '0xff0184056B7865F924ea3c0C1823882ad388421b',
    block_explorer: 'https://arbiscan.io/',
    safeMinion: {
      minion_factory_addr: '',
      safe_mutisend_addr: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
      safe_sign_lib_addr: '0xa25b3579a295be016de5eb5F082b54B12d45F72C',
    },
    superfluid: {
      minion_factory_addr: '',
      resolver: '',
      subgraph_url: '',
      superapp_addr: {
        v1: '',
      },
      version: 'v1',
    },
    niftyMinion: {
      minion_factory_addr: '0xA92CbC525EabFa5baE4e0ff7bDa8E011B43B9aCC',
      version: 'v1',
    },
  },
  // '0x4a': {
  //   name: 'IDChain',
  //   short_name: 'idchain',
  //   nativeCurrency: 'EIDI',
  //   network_id: 74,
  //   chain_id: '0x4a',
  //   hub_sort_order: 4,
  //   providers: ['walletconnect'],
  //   rpc_url: 'https://idchain.one/rpc/',
  //   abi_api_url:
  //     'https://explorer.idchain.one/api?module=contract&action=getabi&address=',
  //   subgraph_url:
  //     'https://graph.idchain.one/subgraphs/name/idchain/daohaus-supergraph',
  //   stats_graph_url:
  //     'https://graph.idchain.one/subgraphs/name/idchain/daohaus-stats',
  //   boosts_graph_url: '',
  //   minion_factory_addr: '0x90253955D4066eE27C183B4644089a5A04A888F1',
  //   moloch_factory_addr: '0x99B4525D6d6F6c3161D0abd6A58B482f46ad5Cd0',
  //   dai_contract: '0xE1A400f340bf4eeDbc4Bbb553f1BFf7Ec4656E3e',
  //   wrapper_contract: '0x2b309226500ADc5956a422950A2AD6E6333Bb315',
  //   wrap_n_zap_factory_addr: '0x',
  //   block_explorer: 'https://explorer.idchain.one',
  // },
};

export const chainByID = chainID => {
  console.log(chainID, supportedChains);
  return supportedChains[chainID];
};
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
    42161: supportedChains['0xa4b1'],
    1666700000: supportedChains['0x6357d2e0'],
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
  '0xA4B1': {
    chainId: '0xA4B1',
    chainName: 'Arbitrum',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
    nativeCurrency: {
      name: 'ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export const EIP3085 = {
  SUPPORTED: {
    '0x64': true,
    '0x89': true,
    '0x4a': true,
    '0xA4B1': true,
  },
  NOT_SUPPORTED: {
    '0x1': true,
    '0x2a': true,
    '0x4': true,
  },
};

export const NIFTYINK_ADDRESS = '0xcf964c89f509a8c0ac36391c5460df94b91daba5';
