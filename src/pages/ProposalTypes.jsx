import React, { useState } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

import { useParams } from 'react-router-dom';
import {
  useConfirmation,
  useFormModal,
  useOverlay,
} from '../contexts/OverlayContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

import PlaylistSelector from '../components/playlistSelector';
import MainViewLayout from '../components/mainViewLayout';
import ProposalList from '../components/formList';
import SaveButton from '../components/saveButton';
import { updateProposalConfig } from '../utils/metadata';
import { CORE_FORMS } from '../data/forms';
import { chainByID } from '../utils/chain';

const dev = process.env.REACT_APP_DEV;

const orderPlaylistForms = playlists =>
  playlists?.map(list => ({ ...list, forms: list.forms.sort() }));

const ProposalTypes = () => {
  const {
    daoProposals,
    daoMetaData,
    dispatchPropConfig,
    refetchMetaData,
  } = useMetaData();
  const { injectedProvider, address } = useInjectedProvider();
  const { openFormModal, closeModal } = useFormModal();
  const { successToast, errorToast } = useOverlay();
  const { openConfirmation } = useConfirmation();
  const { playlists, allForms = {}, customData, devList } = daoProposals || {};
  const { daochain } = useParams();
  const [selectedListID, setListID] = useState(
    dev && devList?.forms?.length ? 'dev' : 'all',
  );
  const [loading, setLoading] = useState(false);

  const selectList = id => {
    if (!id) return;
    if (id === selectedListID) {
      setListID(null);
    } else {
      setListID(id);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    await updateProposalConfig(daoProposals, {
      injectedProvider,
      meta: daoMetaData,
      address,
      network: chainByID(daochain).network,
      onSuccess: () => {
        successToast({ title: 'Proposal data updated!' });
        refetchMetaData();
        setLoading(false);
      },
      onError: error => {
        errorToast({
          title: 'Error saving Proposal Data',
          description: error.message || '',
        });
        setLoading(false);
      },
    });
  };

  const handleSaveConfig = () => {
    if (dev) {
      openConfirmation({
        onSubmit: async () => {
          closeModal();
          await saveConfig();
        },
        title: 'DEV WARNING',
        header: 'DEV WARNING',
        body:
          'Local DEV builds may have data that is out of sync with the app branch. If you are pushing a form to the DAO metadata, make sure the form exists on the app branch first.',
      });
    } else {
      saveConfig();
    }
  };

  const editPlaylist = id => {
    openFormModal({
      lego: CORE_FORMS.EDIT_PLAYLIST,
      onSubmit: ({ values }) => {
        const name = values?.title;
        if (name && id) {
          dispatchPropConfig({ action: 'EDIT_PLAYLIST', id, name });
          closeModal();
        }
      },
    });
  };

  const deletePlaylist = id => {
    const playlist = playlists.find(list => list.id === id);
    openConfirmation({
      title: 'Delete Playlist',
      header: `Are you sure you want to delete '${playlist?.name}'?`,
      onSubmit() {
        dispatchPropConfig({ action: 'DELETE_PLAYLIST', id });
        closeModal();
      },
    });
  };

  const addPlaylist = () => {
    openFormModal({
      lego: CORE_FORMS.ADD_PLAYLIST,
      onSubmit: ({ values }) => {
        dispatchPropConfig({ action: 'ADD_PLAYLIST', name: values.title });
        closeModal();
      },
    });
  };

  const undoChanges = () => {
    dispatchPropConfig({ action: 'UNDO_CHANGES', daoMetaData });
  };

  return (
    <MainViewLayout isDao header='Proposal Types'>
      <Flex flexDir='column' maxW={['100%', '90%', '80%']}>
        <Flex mb={[6, 12]} justifyContent='flex-end'>
          <SaveButton
            watch={orderPlaylistForms(playlists)}
            saveFn={handleSaveConfig}
            disabled={loading}
            blockRouteOnDiff
            undoChanges={undoChanges}
          >
            SAVE CHANGES {loading && <Spinner ml={3} />}
          </SaveButton>
        </Flex>
        {daoProposals ? (
          <Flex flexDir={['column', 'column', 'row']}>
            <PlaylistSelector
              selectList={selectList}
              addPlaylist={addPlaylist}
              allForms={allForms}
              selectedListID={selectedListID}
              playlists={playlists}
              deletePlaylist={deletePlaylist}
              editPlaylist={editPlaylist}
              devList={devList}
            />
            <ProposalList
              playlists={playlists}
              customData={customData}
              selectedListID={selectedListID}
              allForms={allForms}
              devList={devList}
              selectList={selectList}
            />
          </Flex>
        ) : (
          <Spinner />
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default ProposalTypes;
