import { put } from '../utils/metadata';
import { createPlaylist, generateNewConfig } from '../utils/playlists';

const handleInit = payload => {
  if (payload?.proposalConfig) {
    return payload.proposalConfig;
  }
  return generateNewConfig(payload);
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
export const handleUpdateChanges = async (state, params) => {
  const { meta, injectedProvider, address, network } = params;

  if (!meta || !injectedProvider || !state || !network)
    throw new Error('proposalConfig => handlePostNewConfig');
  try {
    const messageHash = injectedProvider.utils.sha3(meta.contractAddress);
    const signature = await injectedProvider.eth.personal.sign(
      messageHash,
      address,
    );
    const updateData = {
      proposalConfig: state,
      contractAddress: meta.contractAddress,
      network,
      signature,
    };
    const res = await put('dao/update', updateData);
    if (res.error) throw new Error(res.error);
    return res;
  } catch (error) {
    console.error(error);
  }
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
  throw new Error('Error in ProposalConfig Reducer => Invalid Action');
};
