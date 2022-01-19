// TX = {
//   contract: String
//   poll: String (Optional)(Defaults to name)
//   name: String
//   display: String  (Optional)(Defaults to name)
//   errMsg: String
//   onTxHash: {}Strings
//   successMsg: String
// }

// this was causing a site crash - used for iniitialization
// import { HASH } from '../utils/general';
import { MINION_TYPES } from '../utils/proposalUtils';

const HASH = {
  EMPTY_FIELD: 'e3bb180f-dda4-46e0-8ba5-7b24e7b00855',
  AWAITING_VALUE: '13345e28-135b-46ed-8047-716324197a6b',
  PROPS_MESSAGE: 'b136aa06-7d7c-42a3-824f-c92ed163b18a',
};

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
  UBERHAUS_MINION: {
    location: 'local',
    abiName: 'UBERHAUS_MINION',
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
};

export const ACTIONS = {
  PROPOSAL: ['closeProposalModal', 'openTxModal'],
  BASIC: ['openTxModal'],
  GENERIC_MODAL: ['closeGenericModal', 'openTxModal'],
};

//  HASH.EMPTY_FIELD with '||' allows the search to turn up
//  falsy without crashing searchFields()

//  buildJSONdetails simply filters any values that are HASH.EMPTY_FIELD
//  any other falsy will get stringified as is.

export const DETAILS = {
  STANDARD_PROPOSAL: {
    title: `.values.title`,
    description: `.values.description || ${HASH.EMPTY_FIELD}`,
    link: `.values.link || ${HASH.EMPTY_FIELD}`,
    proposalType: '.formData.type',
  },
  VANILLA_MINION_PROPOSAL: {
    title: `.values.title`,
    description: `.values.description`,
    proposalType: '.formData.type',
    minionType: MINION_TYPES.VANILLA,
  },
  PAYROLL_PROPOSAL: {
    title: '.values.title',
    description: `.values.description || ${HASH.EMPTY_FIELD}`,
    link: `.values.link || ${HASH.EMPTY_FIELD}`,
    proposalType: '.formData.type',
    minionType: '.formData.minionType',
  },
  MINION_NFT_TRANSFER: {
    title: 'Minion sends a NFT',
    description: '.values.description',
    proposalType: '.formData.type',
  },
  MINION_SELL_NIFTY: {
    title: 'Minion sets Nifty price',
    description: '.values.description',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.VANILLA,
  },
  MINION_BUY_NIFTY: {
    title: 'Minion Buys a NiftyInk',
    description: '.values.nftMetadata.name',
    link: '.values.nftMetadata.image',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.NIFTY,
  },
  SUPERFLUID_STREAM: {
    title: `.values.title`,
    description: `.values.description || ${HASH.EMPTY_FIELD}`,
    link: `.values.link || ${HASH.EMPTY_FIELD}`,
    proposalType: '.formData.type',
    recipient: '.values.applicant',
    token: '.values.paymentToken',
    tokenRate: '.values.rateString',
  },
  SELL_NFT_RARIBLE: {
    title: 'Rarible NFT Sell Order',
    description: '.values.raribleDescription',
    link: '.values.image',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.SAFE,
    orderIpfsHash: '.values.ipfsOrderHash',
    eip712HashValue: '.values.eip712HashValue',
  },
  SET_BUYOUT_TOKEN: {
    title: '.values.title',
    description: `.values.description || ${HASH.EMPTY_FIELD}`,
    link: `.values.link || ${HASH.EMPTY_FIELD}`,
    proposalType: '.formData.type',
    minionType: MINION_TYPES.SAFE,
  },
  SET_BUYOUT_NFT: {
    title: '.values.title',
    description: '.values.description',
    link: '.values.link',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.SAFE,
  },
  OFFER_NFT_TRIBUTE: {
    title: '.values.title',
    description: '.values.description',
    link: '.values.link',
    proposalType: '.formData.type',
  },
  BUY_NFT_RARIBLE: {
    title: 'Rarible NFT Buy Order',
    description: '.values.nftDescription',
    link: '.values.image',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.SAFE,
    orderIpfsHash: '.values.ipfsOrderHash',
    eip712HashValue: '.values.eip712HashValue',
  },
  DISPERSE_TOKEN: {
    title: '.values.title || Disperse Proposal',
    description: '.values.description',
    link: '.values.link',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.SAFE,
    token: '.values.tokenAddress',
  },
  DISPERSE_ETH: {
    title: '.values.title || Disperse Proposal',
    description: '.values.description',
    link: '.values.link',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.SAFE,
  },
};

export const TX = {
  SUBMIT_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'submitProposal',
    onTxHash: ACTIONS.PROPOSAL,
    poll: 'subgraph',
    display: 'Submit Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Proposal submitted!',
    gatherArgs: [
      '.values.applicant || .contextData.address',
      '.values.sharesRequested || 0',
      '.values.lootRequested || 0',
      '.values.tributeOffered || 0',
      '.values.tributeToken || .contextData.daoOverview.depositToken.tokenAddress',
      '.values.paymentRequested || 0',
      '.values.paymentToken || .contextData.daoOverview.depositToken.tokenAddress',
      { type: 'detailsToJSON', gatherFields: DETAILS.STANDARD_PROPOSAL },
    ],
    createDiscourse: true,
  },
  LOOT_GRAB_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'submitProposal',
    onTxHash: ACTIONS.PROPOSAL,
    poll: 'subgraph',
    display: 'Submit Loot Grab Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Loot Grab submitted!',
    gatherArgs: [
      '.contextData.address',
      0,
      '.values.lootRequested',
      '.values.tributeOffered',
      '.values.tributeToken',
      0,
      '.contextData.daoOverview.depositToken.tokenAddress',
      JSON.stringify({
        title: 'Loot Grab Proposal',
        description: 'Trade Tokens for Loot',
      }),
    ],
  },
  GUILDKICK_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'submitGuildKickProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submit GuildKick Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Guild Kick Proposal submitted!',
    createDiscourse: true,
    gatherArgs: [
      '.values.applicant',
      { type: 'detailsToJSON', gatherFields: DETAILS.STANDARD_PROPOSAL },
    ],
  },
  WHITELIST_TOKEN_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'submitWhitelistProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Whitelist Token Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Token Proposal submitted!',
    createDiscourse: true,
    gatherArgs: [
      '.values.tokenAddress',
      { type: 'detailsToJSON', gatherFields: DETAILS.STANDARD_PROPOSAL },
    ],
  },
  UNLOCK_TOKEN: {
    contract: CONTRACTS.ERC_20,
    name: 'approve',
    specialPoll: 'unlockToken',
    onTxHash: null,
    display: 'Approve Spend Token',
    errMsg: 'Approve Token Failed',
    successMsg: 'Approved Token!',
  },
  UNLOCK_NFTS: {
    contract: CONTRACTS.LOCAL_ERC_721,
    name: 'setApprovalForAll',
    specialPoll: 'approveAllTokens',
    onTxHash: null,
    display: 'Approve All Tokens',
    errMsg: 'Approve Tokens Failed',
    successMsg: 'Approved Tokens!',
  },
  MINION_PROPOSE_ACTION: {
    contract: CONTRACTS.SELECTED_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Propose Minion Action',
    errMsg: 'Error submitting action to minion',
    successMsg: 'Minion Proposal Created!',
    createDiscourse: true,
    argsFromCallback: 'proposeActionVanilla',
  },
  MINION_PROPOSE_ACTION_NIFTY: {
    contract: CONTRACTS.SELECTED_MINION_NIFTY,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Propose Minion Action',
    errMsg: 'Error submitting action to minion',
    successMsg: 'Minion Proposal Created!',
    argsFromCallback: 'proposeActionNifty',
    createDiscourse: true,
  },
  MINION_PROPOSE_ACTION_SAFE: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Propose Minion Action',
    errMsg: 'Error submitting action to minion',
    successMsg: 'Minion Proposal Created!',
    argsFromCallback: 'proposeActionSafe',
    createDiscourse: true,
  },
  CANCEL_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'cancelProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Cancel Proposal',
    errMsg: 'Error cancelling proposal',
    successMsg: 'Proposal Cancelled!',
  },
  SPONSOR_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'sponsorProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Sponsor Proposal',
    errMsg: 'Error sponsoring proposal',
    successMsg: 'Proposal Sponsored!',
  },
  SUBMIT_VOTE: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'submitVote',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Submit Vote',
    errMsg: 'Error Submitting Vote',
    successMsg: 'Vote Submitted!',
  },
  PROCESS_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'processProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Process Proposal',
    errMsg: 'Error Processing Proposal',
    successMsg: 'Proposal Processed!',
  },
  PROCESS_GK_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'processGuildKickProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Process Proposal',
    errMsg: 'Error Processing Proposal',
    successMsg: 'Proposal Processed!',
  },
  PROCESS_WL_PROPOSAL: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'processWhitelistProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Process Proposal',
    errMsg: 'Error Processing Proposal',
    successMsg: 'Proposal Processed!',
  },
  COLLECT_TOKENS: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'collectTokens',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Sync Token Balances',
    errMsg: 'Error Syncing Token Balances',
    successMsg: 'Token Balances Synced!',
  },
  UPDATE_DELEGATE: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'updateDelegateKey',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Update Delegate Key',
    errMsg: 'Error Updating Delegate Key',
    successMsg: 'Delegate Key Updated!',
    gatherArgs: ['.values.delegateAddress'],
  },
  WITHDRAW: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'withdrawBalance',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Withdraw Balance',
    errMsg: 'Error Withdrawing Balance',
    successMsg: 'Balance Withdrawn!',
  },
  RAGE_QUIT: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'ragequit',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Rage Quit',
    errMsg: 'Error Rage Quitting',
    successMsg: 'Rage quit processed!',
    gatherArgs: ['.values.shares || 0', '.values.loot || 0'],
  },
  RAGE_QUIT_CLAIM: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'ragequit',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Rage Quit',
    errMsg: 'Error Rage Quitting',
    successMsg: 'Rage quit processed!',
    // gatherArgs: [
    //   '.contextData.daoMember.shares',
    //   '.contextData.daoMember.loot',
    // ],
  },
  RAGE_KICK: {
    contract: CONTRACTS.CURRENT_MOLOCH,
    name: 'ragekick',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Rage Kick',
    errMsg: 'Error Rage Kicking',
    successMsg: 'Rage kick processed!',
  },
  PAYROLL: {
    contract: CONTRACTS.SELECTED_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Sending Token',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.values.minionToken',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.ERC_20,
        fnName: 'transfer',
        gatherArgs: ['.values.applicant', '.values.minionPayment'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
    ],
  },
  PAYROLL_NIFTY: {
    contract: CONTRACTS.SELECTED_MINION_NIFTY,
    name: 'proposeAction',
    poll: 'subgraph',

    onTxHash: ACTIONS.PROPOSAL,
    display: 'Sending Token',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.values.minionToken',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.ERC_20,
        fnName: 'transfer',
        gatherArgs: ['.values.applicant', '.values.minionPayment'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
    ],
  },
  MINION_WITHDRAW: {
    contract: CONTRACTS.LOCAL_VANILLA_MINION,
    name: 'crossWithdraw',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Transfer Balance',
    errMsg: 'Error Transferring Balance',
    successMsg: 'Balance Transferred!',
  },
  MINION_CANCEL: {
    contract: CONTRACTS.LOCAL_VANILLA_MINION,
    name: 'cancelAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Cancel Minion',
    errMsg: 'Error Cancelling Minion',
    successMsg: 'Cancelled Minion!',
  },
  ESCROW_MINION_CANCEL: {
    contract: CONTRACTS.ESCROW_MINION,
    name: 'cancelAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Cancel Minion',
    errMsg: 'Error Cancelling Minion',
    successMsg: 'Cancelled Minion!',
  },
  MINION_SELL_NIFTY: {
    contract: CONTRACTS.LOCAL_VANILLA_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Sell Nifty',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.localValues.contractAddress',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.NIFTY_INK,
        fnName: 'setTokenPrice',
        gatherArgs: ['.localValues.tokenId', '.values.price'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_SELL_NIFTY,
      },
    ],
  },
  MINION_SELL_NIFTY_NIFTY: {
    contract: CONTRACTS.LOCAL_NIFTY_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Sell Nifty',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.localValues.contractAddress',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.NIFTY_INK,
        fnName: 'setTokenPrice',
        gatherArgs: ['.localValues.tokenId', '.values.price'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_SELL_NIFTY,
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
    ],
  },
  MINION_SIMPLE_EXECUTE: {
    contract: CONTRACTS.MINION_SIMPLE_EXECUTE,
    name: 'executeAction',
    poll: 'subgraph',
    specialPoll: 'executeAction',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Executing Minion Proposal',
    errMsg: 'Error Executing Minion Proposal',
    successMsg: 'Minion Proposal Executed!',
  },
  UBER_EXECUTE_ACTION: {
    contract: CONTRACTS.UBERHAUS_MINION,
    name: 'executeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Executing Minion Proposal',
    errMsg: 'Error Executing Minion Proposal',
    successMsg: 'Minion Proposal Executed!',
  },
  APPROVE_UHMINION_HAUS: {
    contract: CONTRACTS.UBERHAUS_MINION,
    name: 'approveUberHaus',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Approving HAUS',
    errMsg: 'Error Approving HAUS',
    successMsg: "Approved Minion's HAUS",
  },
  // MINION_SAFE_EXECUTE: {
  //   contract: CONTRACTS.MINION_SAFE_EXECUTE,
  //   name: 'executeAction',
  //   poll: 'subgraph',
  //   onTxHash: ACTIONS.GENERIC_MODAL,
  //   display: 'Executing Minion Proposal',
  //   errMsg: 'Error Executing Minion Proposal',
  //   successMsg: 'Minion Proposal Executed!',
  // },
  SUPERFLUID_MINION_EXECUTE: {
    contract: CONTRACTS.SUPERFLUID_MINION_LOCAL,
    name: 'executeAction',
    specialPoll: 'executeAction',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Executing Minion Proposal',
    errMsg: 'Error Executing Minion Proposal',
    successMsg: 'Minion Proposal Executed!',
  },
  UBERHAUS_MINION_EXECUTE_APPOINTMENT: {
    contract: CONTRACTS.UBERHAUS_MINION,
    name: 'executeAppointment',
    specialPoll: 'executeAction',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Executing Minion Proposal',
    errMsg: 'Error Executing Minion Proposal',
    successMsg: 'Minion Proposal Executed!',
  },
  SUMMON_MINION_AND_SAFE: {
    contract: CONTRACTS.SAFE_MINION_FACTORY,
    name: 'summonMinionAndSafe',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.values.minionName',
      '.values.minQuorum || 0',
      '.values.saltNonce',
    ],
  },
  SUMMON_MINION_SAFE: {
    contract: CONTRACTS.SAFE_MINION_FACTORY,
    name: 'summonMinion',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.values.safeAddress',
      '.values.minionName',
      '.values.minQuorum || 0',
      '.values.saltNonce',
    ],
  },
  SUMMON_MINION_NIFTY: {
    contract: CONTRACTS.NIFTY_MINION_FACTORY,
    name: 'summonMinion',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.values.minionName',
      '.values.minQuorum',
    ],
  },
  SUMMON_MINION_VANILLA: {
    contract: CONTRACTS.VANILLA_MINION_FACTORY,
    name: 'summonMinion',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: ['.contextData.daoid', '.values.minionName'],
  },
  SUMMON_MINION_SUPERFLUID: {
    contract: CONTRACTS.SUPERFLUID_MINION_FACTORY,
    name: 'summonMinion',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.contextData.chainConfig.superfluid.superapp_addr.v1',
      '.values.minionName',
    ],
  },
  MINION_BUY_NIFTY_INK: {
    contract: CONTRACTS.SELECTED_MINION_NIFTY,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Buy NiftyInk',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '0xcf964c89f509a8c0ac36391c5460df94b91daba5',
      '.values.paymentRequested',
      {
        type: 'encodeHex',
        contract: CONTRACTS.NIFTY_INK,
        fnName: 'buyInk',
        gatherArgs: ['.values.ipfsHash'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_BUY_NIFTY,
      },
      '.values.paymentToken',
      '.values.paymentRequested',
    ],
  },
  CREATE_WRAP_N_ZAP: {
    contract: CONTRACTS.WRAP_N_ZAP_FACTORY,
    name: 'create',
    poll: 'boostSubgraph',
    display: 'Create Wrap-N-Zap',
    errMsg: 'Error creating Wrap-N-Zap',
    successMsg: 'Wrap-N-Zap added!',
    gatherArgs: [
      '.contextData.daoid',
      '.contextData.chainConfig.wrapper_contract',
    ],
  },
  POKE_WRAP_N_ZAP: {
    contract: CONTRACTS.WRAP_N_ZAP,
    name: 'poke',
    onTxHash: ACTIONS.GENERIC_MODAL,
    specialPoll: 'pollWrapNZap',
    display: 'Poke Wrap-N-Zap',
    errMsg: 'Error poking Wrap-N-Zap',
    successMsg: 'Wrap-N-Zap Poke Successful!',
  },
  SUPERFLUID_STREAM: {
    contract: CONTRACTS.SUPERFLUID_MINION_SELECT,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Stream Proposal',
    errMsg: 'Error Submitting Proposals',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      '.values.applicant',
      '.values.paymentToken',
      '.values.weiRatePerSec',
      '.values.paymentRequested',
      '0x0',
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.STANDARD_PROPOSAL,
      },
    ],
  },
  SELL_NFT_RARIBLE: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting NFT Sale Proposal',
    errMsg: 'Error Submitting Proposals',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '.values.nftAddress',
              '.contextData.chainConfig.safeMinion.safe_sign_lib_addr',
            ],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.ERC_721,
                fnName: 'setApprovalForAll',
                gatherArgs: [
                  '.contextData.chainConfig.rarible.nft_transfer_proxy',
                  'true',
                ],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.LOCAL_SAFE_SIGNLIB,
                fnName: 'signMessage',
                gatherArgs: ['.values.eip712HashValue'],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '1'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      0, // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.SELL_NFT_RARIBLE,
      },
      true, // _memberOnlyEnabled
    ],
  },
  BUY_NFT_RARIBLE: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting NFT Buy Proposal',
    errMsg: 'Error Submitting Proposals',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '.values.paymentToken',
              '.contextData.chainConfig.safeMinion.safe_sign_lib_addr',
            ],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.ERC_20,
                fnName: 'approve',
                gatherArgs: [
                  '.contextData.chainConfig.rarible.erc20_transfer_proxy',
                  '.values.totalOrderPrice',
                ],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.LOCAL_SAFE_SIGNLIB,
                fnName: 'signMessage',
                gatherArgs: ['.values.eip712HashValue'],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '1'],
          },
        ],
      },
      '.values.paymentToken', // _withdrawToken
      '.values.totalOrderPrice', // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.BUY_NFT_RARIBLE,
      },
      true, // _memberOnlyEnabled
    ],
  },
  SET_BUYOUT_TOKEN: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Buyout Proposal',
    errMsg: 'Error Submitting Buyout Proposal',
    successMsg: 'Buyout Proposal Submitted',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '.contextData.chainConfig.dao_conditional_helper_addr',
              '.values.paymentToken',
            ],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
        data: [
          {
            type: 'encodeHex',
            contract: CONTRACTS.DAO_CONDITIONAL_HELPER,
            fnName: 'isNotDaoMember',
            gatherArgs: ['.contextData.address', '.contextData.daoid'],
          },
          {
            type: 'encodeHex',
            contract: CONTRACTS.PAYMENT_ERC_20,
            fnName: 'transfer',
            gatherArgs: ['.contextData.address', '.values.paymentRequested'],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
      },
      '.values.paymentToken', // _withdrawToken
      '.values.paymentRequested', // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.SET_BUYOUT_TOKEN,
      },
      true, // _memberOnlyEnabled
    ],
  },
  OFFER_NFT_TRIBUTE: {
    contract: CONTRACTS.ESCROW_MINION,
    name: 'proposeTribute',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting NFT Tribute Proposal',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      '.contextData.daoid',
      {
        type: 'nestedArgs',
        gatherArgs: ['.values.nftAddress'],
      }, // tokenAddresses
      {
        type: 'nestedArgs',
        gatherArgs: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '.values.tokenType',
              '.values.tokenId',
              '.values.numTokens || 0',
            ],
          },
        ],
      }, // typesTokensIdsAmounts
      '.values.selectedSafeAddress', // vaultAddress (Minion Address?)
      {
        type: 'nestedArgs',
        gatherArgs: [
          '.values.sharesRequested',
          '.values.lootRequested',
          '.values.paymentRequested', // Funds
        ],
      }, // tokenAddresses
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.OFFER_NFT_TRIBUTE,
      },
    ],
  },
  GENERIC_SAFE_MULTICALL: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    display: 'Submitting Safe Minion Proposal',
    errMsg: 'Error Submitting Safe Proposal',
    successMsg: 'Safe Minion Proposal Submitted!',
    argsFromCallback: 'multiActionSafe',
  },
  WITHDRAW_ESCROW: {
    contract: CONTRACTS.ESCROW_MINION,
    name: 'withdrawToDestination',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Withdraw Balance from Escrow',
    errMsg: 'Error Withdrawing Balance from Escrow',
    successMsg: 'Balance Withdrawn from Escrow!',
  },
  DISPERSE_TOKEN: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Token Disperse Proposal',
    errMsg: 'Error Token Disperse Proposal',
    successMsg: 'Token Disperse Proposal Submitted!',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '.values.tokenAddress',
              '.contextData.chainConfig.disperse_app',
            ],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.ERC_20,
                fnName: 'approve',
                gatherArgs: [
                  '.contextData.chainConfig.disperse_app',
                  '.values.disperseTotal',
                ],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.DISPERSE_APP,
                fnName: 'disperseTokenSimple',
                gatherArgs: [
                  '.values.tokenAddress',
                  '.values.userList',
                  '.values.amountList',
                ],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      0, // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.DISPERSE_TOKEN,
      },
      true, // _memberOnlyEnabled
    ],
  },
  DISPERSE_ETH: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting ETH Disperse Proposal',
    errMsg: 'Error ETH Disperse Proposal',
    successMsg: 'ETH Disperse Proposal Submitted!',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: ['.contextData.chainConfig.disperse_app'],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['.values.disperseTotal'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.DISPERSE_APP,
                fnName: 'disperseEther',
                gatherArgs: ['.values.userList', '.values.amountList'],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      0, // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.DISPERSE_ETH,
      },
      true, // _memberOnlyEnabled
    ],
  },
};
