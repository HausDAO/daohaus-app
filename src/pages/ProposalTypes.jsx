import React, { useState } from 'react';

import { Flex, Button, Spinner } from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import { CORE_FORMS } from '../data/forms';

import { useConfirmation, useFormModal } from '../contexts/OverlayContext';

import { useMetaData } from '../contexts/MetaDataContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { handleUpdateChanges } from '../reducers/proposalConfig';
import PlaylistSelector from './PlaylistSelector';
import ProposalList from './ProposalList';

const ProposalTypes = () => {
  const { daoProposals, daoMetaData } = useMetaData();
  const { injectedProvider, address, injectedChain } = useInjectedProvider();
  const { openFormModal, closeModal } = useFormModal();
  const { openConfirmation } = useConfirmation();
  const { dispatchPropConfig } = useMetaData();

  const { playlists, allForms = {}, customData } = daoProposals || {};
  const [selectedListID, setListID] = useState('all');
  const [loading, setLoading] = useState(false);

  const selectList = id => {
    if (!id) return;
    if (id === selectedListID) {
      setListID(null);
    } else {
      setListID(id);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    await handleUpdateChanges(daoProposals, {
      injectedProvider,
      meta: daoMetaData,
      address,
      network: injectedChain.network,
    });
    setLoading(false);
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

  return (
    <MainViewLayout isDao header='Proposal Types'>
      <Flex flexDir='column' w='95%'>
        <Flex justifyContent='flex-end' mb={9}>
          <Button size='lg' onClick={handleSaveConfig} disabled={loading}>
            SAVE CHANGES {loading && <Spinner ml={3} />}
          </Button>
        </Flex>
        {daoProposals ? (
          <Flex>
            <PlaylistSelector
              selectList={selectList}
              addPlaylist={addPlaylist}
              allForms={allForms}
              selectedListID={selectedListID}
              playlists={playlists}
              deletePlaylist={deletePlaylist}
              editPlaylist={editPlaylist}
            />
            <ProposalList
              playlists={playlists}
              customData={customData}
              selectedListID={selectedListID}
              allForms={allForms}
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
