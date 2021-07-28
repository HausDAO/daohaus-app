import { FORM } from '../data/forms';
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

const handleAddPlaylist = (state, params) => ({
  ...state,
  playlists: [...state.playlists, createPlaylist({ name: params.name })],
});

const handleAddCustomData = (state, params) => ({
  ...state,
  customData: {
    ...state.customData,
    [params.formId]: { title: params.title, description: params.description },
  },
});

const handleRemoveCustomData = (state, params) => ({
  ...state,
  customData: {
    ...state.customData,
    [params.formId]: null,
  },
});
const handleAddToPlaylist = (state, params) => {
  console.log(params);
  console.log(state);
  const newPlaylists = state.playlists.map(list => {
    console.log(`list`, list);
    if (list.id === params.listId) {
      return {
        ...list,
        forms: params?.isListed
          ? list.forms.filter(formId => formId !== params.formId)
          : [...list.forms, params.formId],
      };
    }
    return list;
  });
  console.log(`newPlaylists`, newPlaylists);
  return {
    ...state,
    playlists: newPlaylists,
  };
};

export const proposalConfigReducer = (state, params) => {
  // if (!params || !state) return state;

  const { action } = params;
  if (action === 'INIT') return handleInit(params.payload);
  if (action === 'EDIT_PLAYLIST') return handleEditPlaylist(state, params);
  if (action === 'DELETE_PLAYLIST') return handleDeletePlaylist(state, params);
  if (action === 'ADD_PLAYLIST') return handleAddPlaylist(state, params);
  if (action === 'EDIT_PROPOSAL') return handleAddCustomData(state, params);
  if (action === 'RESTORE_PROPOSAL')
    return handleRemoveCustomData(state, params);
  if (action === 'TOGGLE_PLAYLIST') return handleAddToPlaylist(state, params);
};
