import { MINION_TYPES } from '../utils/proposalUtils';

import { FORM } from './forms';

export const MINION_NETWORKS = {
  [MINION_TYPES.VANILLA]: 'all',
  [MINION_TYPES.NIFTY]: {
    '0x64': '0xA6B75C3EBfA5a5F801F634812ABCb6Fd7055fd6d',
    '0x1': '0x7EDfBDED3077Bc035eFcEA1835359736Fa342209',
    '0x89': '0x4CCaDF3f5734436B28869c27A11B6D0F4776bc8E',
  },
  [MINION_TYPES.SUPERFLUID]: {
    '0x64': '0xfC86DfDd3b2e560729c78b51dF200384cfe87438',
    '0x89': '0x52acf023d38A31f7e7bC92cCe5E68d36cC9752d6',
    '0x4': '0x4b168c1a1E729F4c8e3ae81d09F02d350fc905ca',
  },
  [MINION_TYPES.SAFE]: {
    '0x4': '0x13319a33b862E9B8BA21cb95f15A880247c22Dd2',
  },
  // [MINION_TYPES.UBER]: {
  //   '0x2a': '0x03042577463E3820F9cA6Ca3906BAad599ba9382',
  //   '0x64': '0xf5106077892992B84c33C35CA8763895eb80B298',
  // },
};

export const MINION_CONTENT = {
  [MINION_TYPES.VANILLA]: {
    title: 'Vanilla Minion',
    description: 'Enable one-time interactions with other smart contracts.',
    info: [
      'Want a simple way to execute smart contract calls automatically based on the outcome of your proposals? ',
      'A vanilla minion is a basic upgrade to your DAO proposals, enabling one-time interactions with other smart contracts once your proposals are passed.',
    ],
    publisher: 'DAOhaus',
    //  MINION_NETWORKS[MINION_TYPES.VANILLA],
  },
  [MINION_TYPES.NIFTY]: {
    title: 'Nifty Minion',
    description: 'For Nifty Ink. Enables Quorum.',
    info: [
      'Within 1 proposal, you are also able to fund your Minion Vault from your Treasury, saving on transaction fees and execution time.',
      'This legacy boost is used for the Nifty Ink Boost, but will soon be phased out to the neapolitan minion.',
    ],
    publisher: 'DAOhaus',
    //  MINION_NETWORKS[MINION_TYPES.NIFTY],
  },
  [MINION_TYPES.UBER]: {
    title: 'Uberhaus Minion',
    description: 'Join and participate in UberHaus - the DAOs of DAOs',
    info: [
      'UberHaus is the DAO of DAOs - governing the ecosystem and roadmap of DAOhaus.',
      'As the gateway to UberHaus governance, the UberHaus Minion enables you to stake your HAUS tokens, manage delegates, withdraw funds and rage-quit from UberHaus.',
    ],
    publisher: 'DAOhaus',
    //  MINION_NETWORKS[MINION_TYPES.UBER],
  },
  [MINION_TYPES.SUPERFLUID]: {
    title: 'Superfluid Minion',
    description: 'Stream Tokens from a minion vault via Superfluid Protocol',
    info: [
      'This minion is a specialized minion used exclusively for Super Fluid',
      'The SuperFluid Minion helps automate ongoing streams of payments via the SuperFluid Protocol.',
      'Set it up once, and your payments will be streamed in real-time.',
    ],
    publisher: 'DAOhaus',
    //  MINION_NETWORKS[MINION_TYPES.SUPERFLUID],
  },
  [MINION_TYPES.SAFE]: {
    title: 'Safe Minion',
    description:
      'Manage assets & execute transactions by leveraging Gnosis Safe smart wallet capabilities',
    info: [
      'The Safe Minion is an upgrade to the Vanilla Minion, allowing you to manage assets and do multiple smart contract transactions by interacting with Gnosis Safe through your DAO.',
      'Thus, the DAO would be able to propose, sign, & execute multiple transactions as well as interact with any Gnosis Safe App via a proposal.',
      'This operation will assign a Minion as both as a signer of the Safe and as a Safe Module.',
      // 'You also need to specify a human member of DAO as a Co-Signer to propose & sign transactions through the Safe UI or via a DAO proposal.',
      'With the ability to set quorum levels, transactions can be executed earlier once quorum requirements are met. This is especially useful for advanced DAOs looking to optimise their proposals velocity, as well as expand proposal functionality beyond governance (such as DeFi, NFTs, etc.)',
    ],
    //  MINION_NETWORKS[MINION_TYPES.SAFE],
  },
  // [MINION_TYPES.RARIBLE]: {
  //   title: 'Rarible Minion',
  //   info: [],
  //    { '0x1': true, '0x4': true },
  // },
};
const SETTINGS_LINKS = {
  VAULT_LINK: {
    localUrl: '/dao/{.daochain}/{.daoid}/vaults/minion/{.minionAddress}',
  },
  UBER_LINK: {
    localUrl: '/dao/{.daochain}/{.daoid}/allies',
  },
  SF_LINK: {
    localUrl: `/dao/{.daochain}/{.daoid}/settings/superfluid-minion/{.minionAddress}`,
  },
};

export const MINIONS = {
  [MINION_TYPES.VANILLA]: {
    minionType: MINION_TYPES.VANILLA,
    content: MINION_CONTENT[MINION_TYPES.VANILLA],
    networks: MINION_NETWORKS[MINION_TYPES.VANILLA],
    summonForm: FORM.NEW_VANILLA_MINION,
    settings: SETTINGS_LINKS.VAULT_LINK,
  },
  [MINION_TYPES.NIFTY]: {
    minionType: MINION_TYPES.NIFTY,
    content: MINION_CONTENT[MINION_TYPES.NIFTY],
    networks: MINION_NETWORKS[MINION_TYPES.NIFTY],
    summonForm: FORM.NEW_NIFTY_MINION,
    settings: SETTINGS_LINKS.VAULT_LINK,
  },
  [MINION_TYPES.SUPERFLUID]: {
    minionType: MINION_TYPES.SUPERFLUID,
    content: MINION_CONTENT[MINION_TYPES.SUPERFLUID],
    networks: MINION_NETWORKS[MINION_TYPES.SUPERFLUID],
    summonForm: FORM.NEW_SUPERFLUID_MINION,
    settings: SETTINGS_LINKS.SF_LINK,
  },
  [MINION_TYPES.SAFE]: {
    minionType: MINION_TYPES.SAFE,
    content: MINION_CONTENT[MINION_TYPES.SAFE],
    networks: MINION_NETWORKS[MINION_TYPES.SAFE],
    summonForm: FORM.NEW_SAFE_MINION,
    settings: SETTINGS_LINKS.VAULT_LINK,
  },
  // [MINION_TYPES.UBER]: {
  //   minionType: MINION_TYPES.UBER,
  //   content: MINION_CONTENT[MINION_TYPES.UBER],
  //   networks: MINION_NETWORKS[MINION_TYPES.UBER],
  //   summonForm: null,
  //   settings: SETTINGS_LINKS.UBER_LINK,
  // },
};
