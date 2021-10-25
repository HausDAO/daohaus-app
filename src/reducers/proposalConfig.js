import { BLACKLIST } from '../data/blacklist';
import { devList, createPlaylist, generateNewConfig } from '../data/playlists';

const handleDevForms = (data = {}) => {
  const isDev = process.env.REACT_APP_DEV;

  return isDev ? { ...data, devList } : { ...data, devList: null };
};

const handleFormBlacklist = (data = {}) => {
  const checkBlacklist = (formList = []) => {
    return formList.filter(formID => !BLACKLIST.FORMS.includes(formID));
  };

  return {
    ...data,
    allForms: { ...data.allForms, forms: checkBlacklist(data.allForms.forms) },
    playlists: data.playlists?.map(list => ({
      ...list,
      forms: checkBlacklist(list.forms),
    })),
  };
};

const handleInit = daoMetaData => {
  if (daoMetaData?.proposalConfig) {
    return handleDevForms(handleFormBlacklist(daoMetaData.proposalConfig));
  }
  console.warn('DID NOT RECIEVE PROPOSAL CONFIG FROM DAO METADATA');
  return handleDevForms(
    handleFormBlacklist(generateNewConfig({ daoMetaData })),
  );
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

const undoChanges = (state, params) => {
  return params?.daoMetaData?.proposalConfig || state;
};

const handleAddToPlaylist = (state, params) => {
  const newPlaylists = state.playlists.map(list => {
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
  return {
    ...state,
    playlists: newPlaylists,
  };
};

export const proposalConfigReducer = (state, params) => {
  const { action } = params;
  if (action === 'INIT') return handleInit(params.payload);
  if (action === 'EDIT_PLAYLIST') return handleEditPlaylist(state, params);
  if (action === 'DELETE_PLAYLIST') return handleDeletePlaylist(state, params);
  if (action === 'ADD_PLAYLIST') return handleAddPlaylist(state, params);
  if (action === 'EDIT_PROPOSAL') return handleAddCustomData(state, params);
  if (action === 'RESTORE_PROPOSAL')
    return handleRemoveCustomData(state, params);
  if (action === 'TOGGLE_PLAYLIST') return handleAddToPlaylist(state, params);
  if (action === 'UNDO_CHANGES') return undoChanges(state, params);
  throw new Error('Error in ProposalConfig Reducer => Invalid Action');
};
