export const CONTRACTS = {
  CURRENT_MOLOCH: {
    location: 'local',
    abiName: 'MOLOCH_V2',
    contractAddress: '.contextData.daoid',
  },
  MINION_ACTION: {
    location: 'fetch',
    // abiName: 'VANILLA_MINION',
    contractAddress: '.values.targetContract',
  },
  SELECTED_MINION: {
    location: 'local',
    abiName: 'VANILLA_MINION',
    contractAddress: '.values.selectedMinion',
  },
  SELECTED_MINION_NIFTY: {
    location: 'local',
    abiName: 'NIFTY_MINION',
    contractAddress: '.values.selectedMinion',
  },
  SELECTED_MINION_SAFE: {
    location: 'local',
    abiName: 'SAFE_MINION',
    contractAddress: '.values.selectedMinion',
  },
  ERC_20: {
    location: 'local',
    abiName: 'ERC_20',
    contractAddress: '.values.tokenAddress',
  },
  ERC_721: {
    location: 'local',
    abiName: 'ERC_721',
    contractAddress: '.values.nftAddress',
  },
  LOCAL_ERC_721: {
    location: 'local',
    abiName: 'ERC_721',
    contractAddress: '.localValues.contractAddress',
  },
  LOCAL_ERC_1155: {
    location: 'local',
    abiName: 'ERC_1155',
    contractAddress: '.localValues.contractAddress',
  },
  LOCAL_ERC_1155_METADATA: {
    location: 'local',
    abiName: 'ERC_1155_METADATA',
    contractAddress: '.localValues.contractAddress',
  },
  LOCAL_VANILLA_MINION: {
    location: 'local',
    abiName: 'VANILLA_MINION',
    contractAddress: '.localValues.minionAddress',
  },
  LOCAL_NIFTY_MINION: {
    location: 'local',
    abiName: 'NIFTY_MINION',
    contractAddress: '.localValues.minionAddress',
  },
  LOCAL_SAFE_MINION: {
    location: 'local',
    abiName: 'SAFE_MINION',
    contractAddress: '.localValues.minionAddress',
  },
  LOCAL_SAFE_MULTISEND: {
    location: 'local',
    abiName: 'SAFE_MULTISEND',
    contractAddress: '.contextData.chainConfig.safeMinion.safe_mutisend_addr',
  },
  LOCAL_SAFE_SIGNLIB: {
    location: 'local',
    abiName: 'SAFE_SIGNLIB',
    contractAddress: '.contextData.chainConfig.safeMinion.safe_sign_lib_addr',
  },
  LOCAL_ERC_20: {
    location: 'local',
    abiName: 'ERC_20',
    contractAddress: '.localValues.tokenAddress',
  },
  NATIVE_WRAPPER: {
    location: 'local',
    abiName: 'NATIVE_WRAPPER',
    contractAddress: '.values.tokenAddress',
  },
  NIFTY_INK: {
    location: 'local',
    abiName: 'NIFTY_INK',
    contractAddress: '0xcf964c89f509a8c0ac36391c5460df94b91daba5',
  },
  MINION_SIMPLE_EXECUTE: {
    location: 'local',
    abiName: 'VANILLA_MINION',
    contractAddress: '.localValues.minionAddress',
  },
  MINION_SAFE_EXECUTE: {
    location: 'local',
    abiName: 'SAFE_MINION',
    contractAddress: '.localValues.minionAddress',
  },
  MINION_SAFE_V2_EXECUTE: {
    location: 'local',
    abiName: 'SAFE_MINION_V2',
    contractAddress: '.localValues.minionAddress',
  },
  SUPERFLUID_MINION_LOCAL: {
    location: 'local',
    abiName: 'SUPERFLUID_MINION',
    contractAddress: '.localValues.minionAddress',
  },
  SUPERFLUID_MINION_SELECT: {
    location: 'local',
    abiName: 'SUPERFLUID_MINION',
    contractAddress: '.values.selectedMinion',
  },
  SUPERFLUID_MINION_FACTORY: {
    location: 'local',
    abiName: 'SUPERFLUID_MINION_FACTORY',
    contractAddress: '.contextData.chainConfig.superfluid.minion_factory_addr',
  },
  SAFE_MINION_FACTORY: {
    location: 'local',
    abiName: 'SAFE_MINION_FACTORY',
    contractAddress: '.contextData.chainConfig.safeMinion.minion_factory_addr',
  },
  NIFTY_MINION_FACTORY: {
    location: 'local',
    abiName: 'NIFTY_MINION_FACTORY',
    contractAddress: '.contextData.chainConfig.niftyMinion.minion_factory_addr',
  },
  VANILLA_MINION_FACTORY: {
    location: 'local',
    abiName: 'VANILLA_MINION_FACTORY',
    contractAddress: '.contextData.chainConfig.minion_factory_addr',
  },
  WRAP_N_ZAP_FACTORY: {
    location: 'local',
    abiName: 'WRAP_N_ZAP_FACTORY',
    contractAddress: '.contextData.chainConfig.wrap_n_zap_factory_addr',
  },
  WRAP_N_ZAP: {
    location: 'local',
    abiName: 'WRAP_N_ZAP',
    contractAddress: '.localValues.contractAddress',
  },
  DAO_CONDITIONAL_HELPER: {
    location: 'local',
    abiName: 'DAO_CONDITIONAL_HELPER',
    contractAddress: '.contextData.chainConfig.dao_conditional_helper_addr',
  },
  PAYMENT_ERC_20: {
    location: 'local',
    abiName: 'ERC_20',
    contractAddress: 'values.paymentToken',
  },
  ESCROW_MINION: {
    location: 'local',
    abiName: 'ESCROW_MINION',
    contractAddress: '.contextData.chainConfig.escrow_minion',
  },
  DISPERSE_APP: {
    location: 'local',
    abiName: 'DISPERSE_APP',
    conractAddress: '.contextData.chainConfig.disperse_app',
  },
  SUPERFLUID_CFA: {
    location: 'local',
    abiName: 'SF_CFA',
    contractAddress: '.contextData.chainConfig.superfluid.cfa',
  },
  SUPERFLUID_HOST: {
    location: 'local',
    abiName: 'SF_HOST',
    contractAddress: '.contextData.chainConfig.superfluid.host',
  },
  SUPERFLUID_SETH: {
    location: 'local',
    abiName: 'SF_SETH',
    contractAddress: '.values.superTokenAddress',
  },
  SUPERTOKEN: {
    location: 'local',
    abiName: 'SF_SUPERTOKEN',
    contractAddress: '.values.superTokenAddress',
  },
  SUPERTOKEN_FACTORY: {
    location: 'local',
    abiName: 'SF_SUPERTOKEN_FACTORY',
    contractAddress: '.contextData.chainConfig.superfluid.supertoken_factory',
  },
  SWAPR_STAKING: {
    location: 'local',
    abiName: 'SWAPR_STAKING',
    contractAddress: '.contextData.chainConfig.swapr.staking',
  },
  POSTER: {
    location: 'local',
    abiName: 'POSTER',
    contractAddress: '.contextData.chainConfig.poster',
  },
  AMB_MODULE: {
    location: 'local',
    abiName: 'AMB_MODULE',
    conractAddress: '.localValues.ambModuleAddress',
  },
  AMB: {
    location: 'local',
    abiName: 'AMB',
    conractAddress: '.localValues.ambAddress',
  },
  MOLOCH_TOKEN_FACTORY: {
    location: 'local',
    abiName: 'MOLOCH_TOKEN_FACTORY',
    contractAddress: '.contextData.chainConfig.moloch_token_factory',
  },
  SBT_FACTORY: {
    location: 'local',
    abiName: 'SBT_FACTORY',
    contractAddress: '.contextData.chainConfig.sbt_factory',
  },
  HEDGEY_BATCH_MINT: {
    location: 'local',
    abiName: 'HEDGEY_BATCH_MINT',
    contractAddress: '.contextData.chainConfig.hedgey_batch_mint_addr',
  },
  NOMAD_MODULE: {
    location: 'local',
    abiName: 'NOMAD_MODULE',
    conractAddress: '.localValues.nomadModuleAddress',
  },
  NOMAD_HOME: {
    location: 'local',
    abiName: 'NOMAD_HOME',
    contractAddress: '.localValues.nomadHomeAddress',
  },
};
