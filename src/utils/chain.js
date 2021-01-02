export const supportedChains = {
  "0x1": {
    name: "Ethereum Mainnet",
    short_name: "eth",
    chain: "ETH",
    network: "mainnet",
    chain_id: 1,
    network_id: 1,
    providers: ["walletconnect", "portis", "fortmatic"],
    rpc_url: `https://mainnet.infura.io/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    abi_api_url:
      "https://api.etherscan.io/api?module=contract&action=getabi&address=",
    metadata_api_url: "https://data.daohaus.club",
    daohaus_url: "https://daohaus.club",
    subgraph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus",
    stats_graph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats",
    boosts_graph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation",
    token_list:
      "https://raw.githubusercontent.com/Uniswap/default-token-list/master/src/tokens/mainnet.json",
    minionFactoryAddr: "0x2A0D29d0a9e5DE91512805c3E2B58c1e95700dDa",
  },
  "0x4": {
    name: "Ethereum Rinkeby",
    short_name: "rin",
    chain: "ETH",
    network: "rinkeby",
    chain_id: 4,
    network_id: 4,
    providers: ["walletconnect", "portis", "fortmatic"],
    rpc_url: `https://rinkeby.infura.io/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    abi_api_url:
      "https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=",
    metadata_api_url: "https://data.daohaus.club",
    daohaus_url: "https://rinkeby.daohaus.club",
    subgraph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-rinkeby",
    stats_graph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-rinkeby",
    boosts_graph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation",
    minionFactoryAddr: "0x316eFCd421b0654B7aE8E806880D4AE88ecaE206",
  },
  "0x2a": {
    name: "Ethereum Kovan",
    short_name: "kov",
    chain: "ETH",
    network: "kovan",
    chain_id: 42,
    network_id: 42,
    providers: ["walletconnect", "portis", "fortmatic"],
    rpc_url: `https://kovan.infura.io/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    abi_api_url:
      "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=",
    metadata_api_url: "https://data.daohaus.club",
    daohaus_url: "https://kovan.daohaus.club",
    subgraph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-kovan",
    stats_graph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-kovan",
    boosts_graph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation",
    minionFactoryAddr: "0x80ec2dB292E7a6D1D5bECB80e6479b2bE048AC98",
  },
  "0x64": {
    name: "xDAI Chain",
    short_name: "xdai",
    chain: "xDAI",
    network: "mainnet",
    chain_id: 100,
    network_id: 1,
    providers: ["walletconnect", "portis"],
    rpc_url: "https://dai.poa.network",
    abi_api_url:
      "https://blockscout.com/poa/xdai/api?module=contract&action=getabi&address=",
    metadata_api_url: "https://data.daohaus.club",
    daohaus_url: "https://xdai.daohaus.club",
    subgraph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai",
    stats_graph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai",
    boosts_graph_url:
      "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation-xdai",
    token_list: "http://tokens.honeyswap.org/",
    minionFactoryAddr: "0x9610389d548Ca0224aCaC40eB3241c5ED88D2479",
    wxdai_contract: "",
  },
};
