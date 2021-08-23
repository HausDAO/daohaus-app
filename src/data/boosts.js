import { BOOST_PLAYLISTS } from '../utils/playlists';
import { MINION_TYPES } from '../utils/proposalUtils';
import { MINIONS } from './minions';
import { PUBLISHERS } from './publishers';

export const CONTENT = {
  DEV_SUITE: {
    title: 'DEV Suite',
    description: 'Developer tools to prototype, build and test your own boosts',
    publisher: PUBLISHERS.DAOHAUS,
    version: '1.00',
    pars: [
      'The DEV Suite is an all-in-one developer toolset for advanced builders to prototype, build and test their own Minions and Boosts.',
    ],
    externalLinks: [{ href: 'https://daohaus.club/', label: 'Boost Support' }],
  },
  OLD_DEV_SUITE: {
    title: 'Old DEV Suite',
    description:
      'Developer tools to prototype, build and test your own boosts. Oldschool.',
    publisher: PUBLISHERS.DAOHAUS,
    version: '1.00',
    pars: [
      'The DEV Suite is an all-in-one developer toolset for advanced builders to prototype, build and test their own Minions and Boosts.',
    ],
    externalLinks: [{ href: 'https://daohaus.club/', label: 'Boost Support' }],
  },
  NIFTY_INK: {
    title: 'Nifty Ink',
    description: 'Buy and Sell Nifty Ink NFTs as a DAO.',
    publisher: PUBLISHERS.DAOHAUS,
    version: '1.00',
    pars: [
      'This NFT boost allows the DAO to interact with Nifty Ink on xDAI.',
      'Buy and Sell Nifty Ink NFTs as a DAO using proposals',
    ],
    externalLinks: [
      {
        href: 'https://github.com/HausDAO/NiftyMInionSummoner',
        label: 'Nifty Minion Code',
      },
      { href: 'https://daohaus.club/', label: 'Boost Support' },
    ],
  },
  WRAP_N_ZAP: {
    title: 'Wrap N Zap',
    description:
      'Allow your DAO to receive native ETH, xDAI, or Polygon without senders needing to wrap it first.',
    publisher: PUBLISHERS.DAOHAUS,
    version: '1.00',
    pars: [
      'Does your DAO regularly receive native ETH, xDAI or Polygon payments?',
      'The Wrap N Zap Boost makes it easier for your senders by automatically receiving and wrapping their native ETH, xDAI or Polygon, so your funds are nicely wrapped and supported by the DAO vaults.',
    ],
    externalLinks: [
      {
        href: '	https://github.com/HausDAO/wrap-n-zap',
        label: 'Contract Code',
      },
      { href: 'https://discord.gg/gAWWhpN8', label: 'Boost Support' },
    ],
  },
  SNAPSHOT: {
    title: 'Snapshot Proposals',
    description:
      'Gasless voting for quicker, smaller decisions or just collecting signal.',
    publisher: PUBLISHERS.DAOHAUS,
    version: '0.5',
    pars: ['AWAITING CONTENT'],
    externalLinks: [
      { href: 'https://discord.gg/gAWWhpN8', label: 'Boost Support' },
    ],
  },
  DISCORD: {
    title: 'Discord Notifications',
    description:
      'Gasless voting for quicker, smaller decisions or just collecting signal.',
    publisher: PUBLISHERS.DAOHAUS,
    version: '0.5',
    pars: [
      'Customise and send notifications of your DAO’s activity to your Discord server with this boost.',
      'With Discord notifications, keep your DAO members involved and updated whenever there are new proposals to vote, sponsor or process.',
    ],
    externalLinks: [
      { href: 'https://discord.gg/gAWWhpN8', label: 'Boost Support' },
    ],
  },
  MINT_GATE: {
    title: 'Mint Gate',
    description: 'Gate links to restrict view access to DAO members only',
    publisher: PUBLISHERS.DAOHAUS,
    version: '0.5',
    pars: [
      'Mintgate is a Boost which enables your DAO to create and lock content behind DAO membership. ',
      'Once you set it up, only users with DAO shares can access these links.',
      'This is especially useful for content creators looking to gate the access to their content to DAO members, or DAOs looking to keep sensitive information to the right audience.',
    ],
    externalLinks: [
      { href: 'https://discord.gg/gAWWhpN8', label: 'Boost Support' },
    ],
  },
  SUPERFLUID: {
    title: 'Superfluid',
    description: 'Stream tokens from a minion vault via Superfluid Protocol',
    publisher: PUBLISHERS.DAOHAUS,
    version: '0.5',
    pars: [
      'Does your DAO have ongoing and recurring payments? If yes, the SuperFluid Minion helps automate ongoing streams of payments via the SuperFluid Protocol to vendors, other DAOs and any addresses',
      'Set it up once, and your payments will be streamed in real-time automatically as long as your minion vault has sufficient funds.',
    ],
    externalLinks: [
      { href: 'https://discord.gg/gAWWhpN8', label: 'Boost Support' },
    ],
  },
  DISCOURSE: {
    title: 'Discourse Forum',
    description: 'Create a Discourse forum for your DAO to discuss proposals',
    publisher: PUBLISHERS.DAOHAUS,
    version: '1.0',
    pars: [
      'This boost helps your DAO integrate with and create a forum via Discourse -- a widely-used open source forum platform',
      'With each proposal, the Boost automatically creates a forum post, so that DAO members can have long-form and in-depth discussions for the decisions that matter.',
    ],
    externalLinks: [
      { href: 'https://discord.gg/gAWWhpN8', label: 'Boost Support' },
    ],
  },
  UBERHAUS: {
    title: 'Uberhaus',
    description:
      'Join and participate in UberHaus - the governance for DAOs of DAOs',
    publisher: PUBLISHERS.DAOHAUS,
    version: '0.5',
    pars: [
      'UberHaus is a DAO of DAOs - governing the ecosystem and roadmap of DAOhaus.',
      'As the gateway to UberHaus governance, the UberHaus Minion enables you to stake your HAUS tokens, manage delegates, withdraw funds and rage-quit from UberHaus.',
    ],
    externalLinks: [
      { href: 'https://discord.gg/gAWWhpN8', label: 'Boost Support' },
      {
        href: 'https://github.com/HausDAO/UberHaus-Minion',
        label: 'Minion Contract',
      },
    ],
  },
};

const STEPS = {
  MINION_BOOST: {
    DISPLAY: {
      type: 'boostDetails',
      next: 'STEP1',
      start: true,
      isUserStep: false,
    },
    STEP1: {
      type: 'summoner',
      next: 'STEP2',
      stepLabel: 'Deploy Minion',
      isForBoost: true,
      isUserStep: true,
    },
    STEP2: {
      type: 'signer',
      stepLabel: 'Add Proposals & Sign',
      finish: true,
      isUserStep: true,
    },
  },
  ADD_DISCORD: {},
  ADD_DISCOURSE: {},
  ADD_SNAPSHOT: {},
  ADD_MINTGATE: {},
};

export const BOOSTS = {
  OLD_DEV_SUITE: {
    id: 'OLD_DEV_SUITE',
    boostContent: CONTENT.OLD_DEV_SUITE,
    minionData: MINIONS[MINION_TYPES.VANILLA],
    categories: ['advanced', 'ops'],
    steps: STEPS.MINION_BOOST,
    playlist: BOOST_PLAYLISTS.OLD_DEV_SUITE,
    networks: 'all',
    cost: 'free',
    createConfig: false,
  },
  DEV_SUITE: {
    id: 'DEV_SUITE',
    boostContent: CONTENT.DEV_SUITE,
    minionData: MINIONS[MINION_TYPES.NEAPOLITAN],
    categories: ['advanced', 'ops'],
    steps: STEPS.MINION_BOOST,
    playlist: BOOST_PLAYLISTS.DEV_SUITE,
    networks: MINIONS[MINION_TYPES.NEAPOLITAN].networks,
    cost: 'free',
  },
  NIFTY_INK: {
    id: 'NIFTY_INK',
    oldId: 'niftyInk',
    boostContent: CONTENT.NIFTY_INK,
    minionData: MINIONS[MINION_TYPES.NIFTY],
    categories: ['nft'],
    steps: STEPS.MINION_BOOST,
    networks: MINIONS[MINION_TYPES.NIFTY].networks,
    playlist: BOOST_PLAYLISTS.NIFTY_INK,
  },
  UBERHAUS: {
    id: 'UBERHAUS',
    boostContent: CONTENT.UBERHAUS,
    minionData: MINIONS[MINION_TYPES.UBER],
    categories: ['social', 'advanced'],
    steps: STEPS.MINION_BOOST,
    networks: MINIONS[MINION_TYPES.UBER].networks,
    playlist: BOOST_PLAYLISTS.UBERHAUS,
  },
  SUPERFLUID: {
    id: 'SUPERFLUID',
    boostContent: CONTENT.SUPERFLUID,
    minionData: MINIONS[MINION_TYPES.SUPERFLUID],
    categories: ['token', 'tools'],
    steps: STEPS.MINION_BOOST,
    networks: MINIONS[MINION_TYPES.SUPERFLUID].networks,
  },
  SNAPSHOT: {
    id: 'SNAPSHOT',
    oldId: 'snapshot',
    boostContent: CONTENT.SNAPSHOT,
    steps: STEPS.ADD_SNAPSHOT,
    categories: ['ops', 'social'],
    networks: 'all',
  },
  // RARIBLE: {
  //   name: 'Rarible',
  //   id: 'rarible',
  //   categories: ['nft'],
  //   playlist: BOOST_PLAYLISTS.RARIBLE,
  // },
  DISCORD: {
    id: 'DISCORD',
    oldId: 'notificationsLevel1',
    steps: STEPS.ADD_SNAPSHOT,
    boostContent: CONTENT.DISCORD,
    categories: ['social'],
    networks: 'all',
  },
  MINT_GATE: {
    id: 'MINT_GATE',
    oldId: 'mintGate',
    steps: STEPS.ADD_MINTGATE,
    boostContent: CONTENT.MINT_GATE,
    categories: ['nft', 'tools'],
    networks: 'all',
  },
  DISCOURSE: {
    id: 'DISCOURSE',
    oldId: 'discourse',
    steps: STEPS.DISCOURSE,
    boostContent: CONTENT.DISCOURSE,
    categories: ['social'],
    networks: 'all',
  },
};

export const allBoosts = {
  name: 'Boosts',
  id: 'all',
  boosts: Object.values(BOOSTS).map(boost => boost.id),
};
const categoryStarter = [
  { name: 'NFT', id: 'nft' },
  { name: 'Advanced', id: 'advanced' },
  { name: 'Social', id: 'social' },
  { name: 'DAO Ops', id: 'ops' },
  { name: 'Defi', id: 'defi' },
  { name: 'Token', id: 'token' },
];
export const categories = categoryStarter.map(cat => ({
  ...cat,
  boosts: Object.values(BOOSTS)
    .filter(boost => boost.categories.includes(cat.id) && !boost.dev)
    .map(cat => cat.id),
}));
