import { FORM } from './forms';
import { MINION_TYPES } from '../utils/proposalUtils';
import { NFT_ACTIONS } from '../utils/nftVaults';

export const MINION_NETWORKS = {
  [MINION_TYPES.VANILLA]: {
    // here for legacy support
    '0x64': false,
    '0x89': false,
    '0x4': false,
    '0x1': false,
    '0x2a': false,
  },
  [MINION_TYPES.NIFTY]: {
    '0x64': true,
    '0x1': true,
    '0x89': true,
    '0xa4b1': true,
    '0xa4ec': true,
  },
  [MINION_TYPES.SUPERFLUID]: {
    '0x64': true,
    '0x89': true,
    '0x4': true,
  },
  [MINION_TYPES.SAFE]: {
    '0x1': true,
    '0x4': true,
    '0x2a': true,
    '0x64': true,
    '0x89': true,
    '0xa4b1': true,
  },
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
    version: '1',
  },
  [MINION_TYPES.NIFTY]: {
    title: 'Nifty Minion',
    description: 'For Nifty Ink. Enables Quorum.',
    info: [
      'Within 1 proposal, you are also able to fund your Minion Vault from your Treasury, saving on transaction fees and execution time.',
      'This legacy boost is used for the Nifty Ink Boost, but will soon be phased out to the neapolitan minion.',
    ],
    publisher: 'DAOhaus',
    version: '2',
  },
  [MINION_TYPES.UBER]: {
    title: 'Uberhaus Minion',
    description: 'Join and participate in UberHaus - the DAOs of DAOs',
    info: [
      'UberHaus is the DAO of DAOs - governing the ecosystem and roadmap of DAOhaus.',
      'As the gateway to UberHaus governance, the UberHaus Minion enables you to stake your HAUS tokens, manage delegates, withdraw funds and rage-quit from UberHaus.',
    ],
    publisher: 'DAOhaus',
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
  },
  [MINION_TYPES.SAFE]: {
    title: 'Safe Minion',
    description:
      'Manage assets & execute transactions by leveraging Gnosis Safe smart wallet capabilities',
    info: [
      "This operation will deploy a new Minion and Gnosis Safe for your DAO, and will give your DAO full control over the Safe's assets and transactions. It enables a wide variety of treasury structures and migration paths for your DAO.",
      'Through this module, your DAO can manage collections of NFTs, manage LP positions with AMMs, and make any other arbitrary interactions.',
      'It also enables DAOs to upgrade their governance framework over time while keeping the assets in one location.',
      'With the ability to set quorum levels, transactions can be executed earlier once quorum requirements are met. This is especially useful for advanced DAOs looking to optimize their proposal velocity, as well as expand proposal functionality beyond governance (such as DeFi, NFTs, etc.)',
    ],
    version: '3',
  },
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
    nftActions: [NFT_ACTIONS.TRANSFER],
  },
  [MINION_TYPES.NIFTY]: {
    minionType: MINION_TYPES.NIFTY,
    content: MINION_CONTENT[MINION_TYPES.NIFTY],
    networks: MINION_NETWORKS[MINION_TYPES.NIFTY],
    summonForm: FORM.NEW_NIFTY_MINION,
    settings: SETTINGS_LINKS.VAULT_LINK,
    nftActions: [NFT_ACTIONS.TRANSFER],
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
    nftActions: [NFT_ACTIONS.TRANSFER],
  },
};
