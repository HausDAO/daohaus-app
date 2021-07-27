import { list } from '@chakra-ui/styled-system';
import { FaPray } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import { FORM } from '../data/forms';

// export const CLASSIC_FORMS = {
//   name: 'The Classics',
//   id: 'classics',
//   forms: [
//     FORM.MEMBER,
//     FORM.FUNDING,
//     FORM.TOKEN,
//     FORM.TRADE,
//     FORM.GUILDKICK,
//     FORM.LOOT_GRAB,
//     FORM.SIGNAL,
//   ],
// };

const BOOST_PLAYLISTS = {
  VANILLA_MINION: {
    name: 'Vanilla Minion',
    id: 'vanillaMinion',
    forms: ['MINION', 'PAYROLL'],
  },
};

export const DEFAULT_PLAYISTS = [
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

export const defaultProposals = {
  name: 'All Proposals',
  id: 'all',
  forms: Object.values(FORM).map(form => form.id),
};

// const checkBoostProposals = (daoMetaData) => {
//   const
// }
// const hydrateDefaults = () => ({
//   playlists: DEFAULT_PLAYISTS.map(list => hydratePlaylist(list)),
//   customData: {},
// });

// const handleProposalConfig = () => {};

export const generatePlaylists = daoMetaData => {
  if (!daoMetaData) return;
  return (
    daoMetaData.proposalConfig || {
      playlists: DEFAULT_PLAYISTS,
      customData: null,
    }
  );
  // return { all, hydratedPlaylists };
};

export const createPlaylist = ({
  name = 'New Playlist',
  id = uuid(),
  forms = [],
}) => ({
  name,
  id,
  forms,
});
