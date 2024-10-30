import { CUSTOM_BOOST_INSTALL_FORMS } from './formLegos/customBoostInstall';
import { FORM } from './formLegos/forms';
import { MINION_TYPES } from '../utils/proposalUtils';
import { NFT_ACTIONS } from '../utils/nftData';

export const MINION_NETWORKS = {
  [MINION_TYPES.VANILLA]: {
    '0x64': true,
    '0x89': true,
    '0x5': true,
    '0x1': true,
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
  },
  [MINION_TYPES.SAFE]: {
    '0x1': true,
    '0x5': true,
  },
  [MINION_TYPES.SAFE]: {
    '0x1': true,
    '0x5': true,
    '0x64': true,
    '0x89': true,
    '0xa4b1': true,
    '0xa': true,
  },
  [MINION_TYPES.CROSSCHAIN_SAFE]: {
    '0x1': false,
    '0x5': true,
    '0x64': true,
  },
  [MINION_TYPES.CROSSCHAIN_SAFE_NOMAD]: {
    '0x1': true,
    '0x4': true,
    '0x5': true,
    '0x64': true,
    '0xa': false,
    '0x89': false,
    '0xa4b1': false,
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
  [MINION_TYPES.CROSSCHAIN_SAFE]: {
    title: 'Cross-chain Safe Minion (AMB)',
    description:
      'Move assets & execute transactions on a Mainnet Gnosis Safe through your Gnosis Chain DAO proposals',
    info: [
      "This operation will deploy a new Gnosis Safe Minion with an AMB Module for your DAO. The Gnosis Safe Minion manages your DAO's funds & interacts with smart contracts, while the AMB Module helps relay data between chains.",
      'By installing this Minion, your DAO will be able to vote on & pass proposals on Gnosis Chain, while controlling assets and executing transactions on Ethereum Mainnet. This gives DAOs greater access to use cases on Mainnet such as DeFis and NFTs, while minimizing governance costs.',
      'With the ability to set quorum levels, transactions can be executed earlier once quorum requirements are met. This is especially useful for advanced DAOs looking to optimize their proposal velocity.',
    ],
    version: '1',
  },
  [MINION_TYPES.CROSSCHAIN_SAFE_NOMAD]: {
    title: 'Cross-chain Safe Minion (Nomad)',
    description:
      'Move assets & execute transactions on a Gnosis Safe from another chain through your DAO proposals',
    info: [
      "This operation will deploy a new Gnosis Safe Minion and Nomad Module for your DAO. The Gnosis Safe Minion manages your DAO's funds & interacts with smart contracts, while the Nomad Module helps relay data between chains.",
      'By installing this Minion, your DAO will be able to vote on & pass proposals on your Home Chain, while controlling assets and executing transactions on a Foreign Chain like Ethereum Mainnet. This gives DAOs greater access to use cases on Mainnet such as DeFis and NFTs, while minimizing governance costs.',
      'With the ability to set quorum levels, transactions can be executed earlier once quorum requirements are met. This is especially useful for advanced DAOs looking to optimize their proposal velocity.',
    ],
    version: '1',
  },
};
const SETTINGS_LINKS = {
  VAULT_LINK: {
    localUrl: '/dao/{.daochain}/{.daoid}/vaults/minion/{.minionAddress}',
  },
  SF_LINK: {
    localUrl: `/dao/{.daochain}/{.daoid}/settings/superfluid-minion/{.minionAddress}`,
  },
};

export const MINIONS = {
  [MINION_TYPES.VANILLA]: {
    minionType: MINION_TYPES.VANILLA,
    content: MINION_CONTENT[MINION_TYPES.VANILLA],
    deprecated: true,
    networks: MINION_NETWORKS[MINION_TYPES.VANILLA],
    summonForm: FORM.NEW_VANILLA_MINION,
    settings: SETTINGS_LINKS.VAULT_LINK,
    nftActions: [NFT_ACTIONS.TRANSFER, NFT_ACTIONS.SELL_NIFTY],
  },
  [MINION_TYPES.NIFTY]: {
    minionType: MINION_TYPES.NIFTY,
    content: MINION_CONTENT[MINION_TYPES.NIFTY],
    deprecated: true,
    networks: MINION_NETWORKS[MINION_TYPES.NIFTY],
    summonForm: FORM.NEW_NIFTY_MINION,
    settings: SETTINGS_LINKS.VAULT_LINK,
    nftActions: [NFT_ACTIONS.TRANSFER, NFT_ACTIONS.SELL_NIFTY],
  },
  [MINION_TYPES.SUPERFLUID]: {
    minionType: MINION_TYPES.SUPERFLUID,
    content: MINION_CONTENT[MINION_TYPES.SUPERFLUID],
    deprecated: true,
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
    nftActions: [NFT_ACTIONS.TRANSFER, NFT_ACTIONS.SELL_RARIBLE],
  },
  [MINION_TYPES.CROSSCHAIN_SAFE]: {
    minionType: MINION_TYPES.SAFE,
    content: MINION_CONTENT[MINION_TYPES.CROSSCHAIN_SAFE],
    networks: MINION_NETWORKS[MINION_TYPES.CROSSCHAIN_SAFE],
    summonForm: CUSTOM_BOOST_INSTALL_FORMS.CROSSCHAIN_MINION,
    addSummonSteps: {
      STEP3: {
        type: 'zodiacActionForm',
        form: CUSTOM_BOOST_INSTALL_FORMS.ZODIAC_CROSSCHAIN_MODULE,
        finish: true,
        ctaText: 'Deploy & Add Module',
        next: 'FINISH',
        stepLabel: 'Deploy Brigde Module for Avatar on Foreign Chain',
        isUserStep: true,
        checklist: ['isConnected'],
      },
    },
    settings: SETTINGS_LINKS.VAULT_LINK,
    nftActions: [NFT_ACTIONS.TRANSFER],
  },
  [MINION_TYPES.CROSSCHAIN_SAFE_NOMAD]: {
    minionType: MINION_TYPES.SAFE,
    content: MINION_CONTENT[MINION_TYPES.CROSSCHAIN_SAFE_NOMAD],
    networks: MINION_NETWORKS[MINION_TYPES.CROSSCHAIN_SAFE_NOMAD],
    summonForm: CUSTOM_BOOST_INSTALL_FORMS.CROSSCHAIN_MINION,
    addSummonSteps: {
      STEP3: {
        type: 'zodiacActionForm',
        form: CUSTOM_BOOST_INSTALL_FORMS.ZODIAC_CROSSCHAIN_MODULE,
        finish: true,
        ctaText: 'Deploy & Add Module',
        next: 'FINISH',
        stepLabel: 'Deploy Nomad Module for Avatar on Foreign Chain',
        isUserStep: true,
        checklist: ['isConnected'],
      },
    },
    settings: SETTINGS_LINKS.VAULT_LINK,
    nftActions: [NFT_ACTIONS.TRANSFER],
  },
};
