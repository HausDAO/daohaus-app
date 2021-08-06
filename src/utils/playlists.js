import { v4 as uuid } from 'uuid';
import { FORM } from '../data/forms';
import { put } from './metadata';

const BOOST_PLAYLISTS = [
  {
    name: 'Vanilla Minion',
    id: 'vanilla minion',
    forms: ['MINION', 'PAYROLL'],
  },
  {
    name: 'Test',
    id: 'test',
    forms: ['CRASH', 'CAT'],
  },
];

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

export const generateNewConfig = daoMetaData => {
  const boostIDs = Object.values(BOOST_PLAYLISTS).map(boost => boost.id);
  const { boosts } = daoMetaData;

  const playlists = boostIDs.reduce((acc, boostID) => {
    if (boosts?.[boostID]) {
      return [...acc, BOOST_PLAYLISTS.find(list => list.id === boostID)];
    }
    return acc;
  }, PLAYLISTS);

  return {
    playlists,
    allForms: {
      name: 'All Proposals',
      id: 'all',
      forms: [
        ...new Set(
          playlists.reduce((acc, list) => [...acc, ...list.forms], []),
        ),
      ],
    },
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
