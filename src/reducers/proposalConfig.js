import { createPlaylist } from '../utils/playlists';

const DEFAULT_PLAYLISTS = [
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

const handleInit = payload => {
  return payload || { playlists: DEFAULT_PLAYLISTS, customData: null };
};

const handleEditPlaylist = (state, params) => {
  const { playlists } = state;
  const newPlaylists = playlists.map(list =>
    list.id === params.id ? { ...list, name: params.name } : list,
  );
  return { ...state, playlists: newPlaylists };
};

const handleDeletePlaylist = (state, params) => {
  const { playlists } = state;
  const newPlaylists = playlists.filter(list => list.id !== params.id);
  return { ...state, playlists: newPlaylists };
};

const handleAddPlaylist = (state, params) => {
  return {
    ...state,
    playlists: [...state.playlists, createPlaylist({ name: params.name })],
  };
};

export const proposalConfigReducer = (state, params) => {
  // if (!params || !state) return state;

  const { action } = params;
  if (action === 'INIT') return handleInit(params.payload);
  if (action === 'EDIT_PLAYLIST') return handleEditPlaylist(state, params);
  if (action === 'DELETE_PLAYLIST') return handleDeletePlaylist(state, params);
  if (action === 'ADD_PLAYLIST') return handleAddPlaylist(state, params);
};
