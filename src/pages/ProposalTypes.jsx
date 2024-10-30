import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useAppModal } from '../hooks/useModals';
import MainViewLayout from '../components/mainViewLayout';
import PlaylistSelector from '../components/playlistSelector';
import FormList from '../components/formList';
import SaveButton from '../components/saveButton';
import { FORM } from '../data/formLegos/forms';
import { chainByID } from '../utils/chain';
import { updateProposalConfig } from '../utils/metadata';
import { useDaoMember } from '../contexts/DaoMemberContext';

const dev = process.env.REACT_APP_DEV === 'true';

const orderPlaylistForms = (playlists, customData) =>
  playlists?.map(list => ({ ...list, forms: list.forms.sort(), customData }));

const ProposalTypes = () => {
  const {
    daoProposals,
    daoMetaData,
    dispatchPropConfig,
    refetchMetaData,
  } = useMetaData();
  const { isMember } = useDaoMember();
  const { injectedProvider, address } = useInjectedProvider();
  const { successToast, errorToast } = useOverlay();
  const { formModal, confirmModal, closeModal } = useAppModal();
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

  const saveConfig = async updateSaveButton => {
    setLoading(true);
    updateProposalConfig(daoProposals, {
      injectedProvider,
      meta: daoMetaData,
      address,
      network: chainByID(daochain).network,
      onSuccess: () => {
        successToast({ title: 'Proposal data updated!' });
        refetchMetaData();
        updateSaveButton?.();
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

  const editPlaylist = id => {
    const playlist = playlists?.find(list => list.id === id);

    formModal({
      ...FORM.EDIT_PLAYLIST,
      title: `Edit ${playlist?.name || 'Playlist'}?`,
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
    confirmModal({
      subtitle: 'Delete Playlist',
      title: `Delete '${playlist?.name}'?`,
      description:
        'Requires member signature. Boost playlists can be restored on the Boosts Marketplace page.',
      onSubmit() {
        dispatchPropConfig({ action: 'DELETE_PLAYLIST', id });
        setListID('all');
        closeModal();
      },
    });
  };

  const addPlaylist = () => {
    formModal({
      ...FORM.ADD_PLAYLIST,
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
            watch={orderPlaylistForms(playlists, customData)}
            saveFn={saveConfig}
            disabled={loading || !isMember}
            blockRouteOnDiff
            undoChanges={undoChanges}
          >
            SAVE CHANGES {loading && <Spinner ml={3} />}
          </SaveButton>
        </Flex>
        {daoProposals ? (
          <Flex flexDir={['column', 'column', 'row']}>
            <PlaylistSelector
              dev={dev}
              selectList={selectList}
              addPlaylist={addPlaylist}
              allForms={allForms}
              selectedListID={selectedListID}
              playlists={playlists}
              deletePlaylist={deletePlaylist}
              editPlaylist={editPlaylist}
              devList={devList}
            />
            <FormList
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
