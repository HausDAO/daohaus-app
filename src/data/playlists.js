import { v4 as uuid } from 'uuid';
import { FORM } from './formLegos/forms';

export const BOOST_PLAYLISTS = {
  OLD_DEV_SUITE: {
    name: 'Vanilla Minion Classics',
    id: 'vanMinionClassics',
    forms: ['MINION', 'PAYROLL'],
  },
  NIFTY_DEV_SUITE: {
    name: 'Nifty Minion Classics',
    id: 'niftyMinionClassics',
    forms: ['MINION_NIFTY', 'PAYROLL_NIFTY'],
  },
  SAFE_DEV_SUITE: {
    name: 'Safe Minion Classics',
    id: 'safeMinionClassics',
    forms: ['MINION_SAFE_SIMPLE', 'MINION_BUYOUT_TOKEN', 'SAFE_TX_BUILDER'],
  },
  CROSSCHAIN_SAFE_DEV_SUITE: {
    name: 'Cross Chain Safe Minion Classics',
    id: 'crossChainSafeMinionClassics',
    forms: ['CROSSCHAIN_SAFE_TX_BUILDER'],
  },
  SAFE_NOMAD_CROSSCHAIN_DEV_SUITE: {
    name: 'Cross Chain Safe Minion Nomad Classics',
    id: 'crossChainSafeMinionNomadClassics',
    forms: ['CROSSCHAIN_SAFE_TX_BUILDER_NOMAD'],
  },
  RARIBLE: {
    name: 'Rarible',
    id: 'rarible',
    forms: ['SELL_NFT_RARIBLE', 'BUY_NFT_RARIBLE'],
  },
  NFT_TRIBUTE: {
    name: 'NFT Tribute',
    id: 'nftTribute',
    forms: ['MINION_TRIBUTE'],
  },
  BANK_BUYOUT: {
    name: 'Bank Buyout',
    id: 'bankBuyout',
    forms: ['MINION_BUYOUT_TOKEN'],
  },
  NIFTY_INK: {
    name: 'NiftyInk',
    id: 'nifty minion',
    forms: ['BUY_NIFTY_INK'],
  },
  SUPERFLUID: {
    name: 'Superfluid',
    id: 'Superfluid minion',
    forms: ['SUPERFLUID_STREAM'],
  },
  SUPERFLUID_SAFE: {
    name: 'Superfluid',
    id: 'superfluidSafeMinion',
    forms: ['SAFE_SUPERFLUID_STREAM'],
  },
  DISPERSE: {
    name: 'Disperse',
    id: 'disperse',
    forms: ['MINION_DISPERSE'],
  },
  POSTER: {
    name: 'Publish',
    id: 'poster',
    forms: ['RATIFY_DAO_DOC', 'POST_IPFS_MD', 'POST_MD'],
  },
  HEDGEY: {
    name: 'Hedgey',
    id: 'hedgey',
    forms: ['CONTRIBUTOR_REWARDS_BOOST'],
  },
};

export const defaultProposals = {
  name: 'All Proposals',
  id: 'all',
  forms: Object.values(FORM).map(form => form.id),
};
export const PLAYLISTS = [
  {
    name: 'Favorites',
    id: 'favorites',
    forms: ['BUY_SHARES', 'SHARES_FOR_WORK', 'TOKEN', 'GUILDKICK'],
  },
  {
    name: 'The Classics',
    id: 'classics',
    forms: [
      'MEMBER',
      'FUNDING',
      'TOKEN',
      'TRADE',
      'GUILDKICK',
      'LOOT_GRAB',
      'SIGNAL',
    ],
  },
];

export const generateNewConfig = ({ daoMetaData }) => {
  const allForms = {
    name: 'All Proposals',
    id: 'all',
    forms: [
      ...new Set(PLAYLISTS.reduce((acc, list) => [...acc, ...list.forms], [])),
    ],
  };
  if (!daoMetaData) {
    console.error('DAO METADATA NOT FOUND: Creating default proposal config');
    return {
      playlists: PLAYLISTS,
      allForms,
    };
  }
  const boostIDs = Object.values(BOOST_PLAYLISTS).map(boost => boost.id);
  const { boosts } = daoMetaData;
  const playlists = boostIDs.reduce((acc, boostID) => {
    if (boosts?.[boostID]) {
      return [
        ...acc,
        Object.values(BOOST_PLAYLISTS).find(list => list.id === boostID),
      ];
    }
    return acc;
  }, PLAYLISTS);
  console.log(playlists);
  return {
    // playlists: PLAYLISTS,
    playlists,
    allForms,
    customData: null,
  };
};

// const checkBoostProposals = (daoMetaData) => {
//   const
// }
// const hydrateDefaults = () => ({
//   playlists: DEFAULT_PLAYISTS.map(list => hydratePlaylist(list)),
//   customData: {},
// });

// const handleProposalConfig = () => {};

// export const generatePlaylists = daoMetaData => {
//   if (!daoMetaData) return;
//   return (
//     daoMetaData.proposalConfig || {
//       playlists: DEFAULT_PLAYISTS,
//       customData: null,
//     }
//   );
//   // return { all, hydratedPlaylists };
// };

export const createPlaylist = ({
  name = 'New Playlist',
  id = uuid(),
  forms = [],
}) => ({
  name,
  id,
  forms,
});
export const devList = createPlaylist({
  name: 'DEV Test List',
  id: 'dev',
  forms: Object.values(FORM).reduce((arr, form) => {
    if (form.dev) {
      return [...arr, form.id];
    }
    return arr;
  }, []),
});

const createNewAllForms = (allForms, newPlaylistForms) => {
  return {
    name: 'All Proposals',
    id: 'all',
    forms: [...new Set([...allForms.forms, ...newPlaylistForms])],
  };
};
export const addBoostPlaylist = (proposalConfig, newPlaylist) => {
  const { playlists, allForms } = proposalConfig;
  if (!playlists || !allForms)
    throw new Error(
      'playlists.js => addBoostPlaylist(): Playlists or allForms is falsy',
    );
  const newAllForms = createNewAllForms(allForms, newPlaylist.forms);
  const newPlaylists = [...playlists, newPlaylist];
  return { ...proposalConfig, playlists: newPlaylists, allForms: newAllForms };
};

export const checkIsPlaylist = playlist =>
  typeof playlist?.id === 'string' &&
  typeof playlist?.name === 'string' &&
  Array.isArray(playlist?.forms);

export const hasPlaylist = (daoMetaData, playlist) => {
  if (!Array.isArray(daoMetaData?.proposalConfig?.playlists) || !playlist?.id)
    return;
  return daoMetaData.proposalConfig.playlists.some(
    list => list.id === playlist.id,
  );
};
