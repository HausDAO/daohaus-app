import React, { useMemo, useState } from 'react';

import {
  Box,
  Icon,
  Flex,
  Button,
  MenuList,
  Menu,
  MenuItem,
  MenuButton,
  Spinner,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';
import { FiTrash2 } from 'react-icons/fi';

import { RiMore2Line, RiStarFill } from 'react-icons/ri';
import { HiPencil, HiRefresh } from 'react-icons/hi';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import { CORE_FORMS, FORM } from '../data/forms';

import { useConfirmation, useFormModal } from '../contexts/OverlayContext';

import { useMetaData } from '../contexts/MetaDataContext';
import { areAnyFields } from '../utils/general';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { handleUpdateChanges } from '../reducers/proposalConfig';
import ListSelector from '../components/ListSelector';
import ListSelectorItem from '../components/ListSelectorItem';

const handleSearch = (formsArr, str) => {
  if (!str) return formsArr;
  if (!formsArr?.length) return [];
  return formsArr.filter(formId =>
    FORM[formId].title.toLowerCase().includes(str),
  );
};

const ProposalTypes = () => {
  const { daoProposals, daoMetaData } = useMetaData();
  const { injectedProvider, address, injectedChain } = useInjectedProvider();
  const { openFormModal, closeModal } = useFormModal();
  const { openConfirmation } = useConfirmation();
  const { dispatchPropConfig } = useMetaData();

  const { playlists, allForms = {}, customData } = daoProposals || {};
  const [selectedList, setSelectedList] = useState('all');
  const [loading, setLoading] = useState(false);

  const selectList = id => {
    if (!id) return;
    if (id === selectedList) {
      setSelectedList(null);
    } else {
      setSelectedList(id);
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
  console.log(allForms);

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
            <ListSelector
              selectList={selectList}
              headerSection={
                <Flex justifyContent='flex-end' mb={4}>
                  <Button variant='ghost' onClick={addPlaylist}>
                    <TextBox mr={2} color='secondary.400'>
                      New Playlist
                    </TextBox>
                  </Button>
                </Flex>
              }
              topListItem={
                <ListSelectorItem
                  lists={allForms?.forms}
                  id='all'
                  isSelected={selectedList === 'all'}
                  selectList={selectList}
                  listLabel={{
                    name: 'Proposals',
                    length: allForms?.forms?.length,
                  }}
                />
              }
              divider='Playlists'
              lists={playlists?.map(list => (
                <ListSelectorItem
                  key={list.id}
                  isSelected={list.id === selectedList}
                  listLabel={{ name: list.name, length: list.forms.length }}
                  id={list.id}
                  selectList={selectList}
                  displayActions={
                    list.id === selectedList && (
                      <SelectorMenu
                        id={list.id}
                        onDelete={deletePlaylist}
                        onEdit={editPlaylist}
                      />
                    )
                  }
                />
              ))}
            />
            <ProposalList
              allForms={allForms}
              forms={selectedList?.forms}
              playlists={playlists}
              customData={customData}
              selectedList={selectedList}
              // toggleFavorite={toggleFavorite}
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

const ProposalList = ({
  playlists,
  toggleFavorite,
  customData,
  selectedList,
  allForms,
}) => {
  const { openFormModal, closeModal } = useFormModal();
  const { dispatchPropConfig } = useMetaData();

  const [searchStr, setSearchStr] = useState(null);

  const forms = useMemo(() => {
    if (!playlists || !selectedList) return [];
    if (selectedList === 'all') {
      return handleSearch(allForms.forms, searchStr);
    }
    return handleSearch(
      playlists.find(list => list.id === selectedList)?.forms,
      searchStr,
    );
  }, [selectedList, playlists, searchStr]);

  const handleEditProposal = formId => {
    openFormModal({
      lego: CORE_FORMS.EDIT_PROPOSAL,
      onSubmit: ({ values }) => {
        dispatchPropConfig({
          action: 'EDIT_PROPOSAL',
          title: values.title,
          description: values.description,
          formId,
        });
        closeModal();
      },
    });
  };
  const handleRestoreProposal = formId => {
    dispatchPropConfig({ action: 'RESTORE_PROPOSAL', formId });
  };

  const handleTogglePlaylist = (formId, listId, isListed) => {
    dispatchPropConfig({ action: 'TOGGLE_PLAYLIST', listId, formId, isListed });
  };

  const handleTypeSearch = e => {
    setSearchStr(e.target.value.toLowerCase());
  };

  return (
    <Flex flexDir='column' w='100%'>
      <Flex mb={4}>
        <TextBox p={2} mr='auto'>
          Proposals
        </TextBox>

        <InputGroup w='200px'>
          <Input onChange={handleTypeSearch} placeholder='Search Proposals' />
        </InputGroup>
      </Flex>
      {forms?.map(formId => (
        <ProposalListItem
          {...FORM[formId]}
          key={formId}
          customFormData={customData?.[formId]}
          toggleFavorite={toggleFavorite}
          handleEditProposal={handleEditProposal}
          handleRestoreProposal={handleRestoreProposal}
          handleTogglePlaylist={handleTogglePlaylist}
          playlists={playlists}
        />
      ))}
    </Flex>
  );
};

const ProposalListItem = ({
  title,
  id,
  description,
  customFormData,
  handleEditProposal,
  handleRestoreProposal,
  handleTogglePlaylist,
  playlists,
}) => {
  const hasBeenEdited = useMemo(
    () => customFormData && areAnyFields('truthy', customFormData),
    [customFormData],
  );

  return (
    <ContentBox mb={4}>
      <Flex justifyContent='space-between'>
        {/* <Image h='70px' minW='70px' mb={6} /> */}
        <Box>
          <TextBox mb={2}>{customFormData?.title || title}</TextBox>
          <Box fontFamily='body' size='sm' color='whiteAlpha.800'>
            {customFormData?.description || description}
          </Box>
        </Box>
        <Flex flexDir='column' justifyContent='space-between'>
          <ProposalMenuList
            handleEditProposal={handleEditProposal}
            handleRestoreProposal={handleRestoreProposal}
            handleTogglePlaylist={handleTogglePlaylist}
            playlists={playlists}
            formId={id}
            hasBeenEdited={hasBeenEdited}
          />
          {hasBeenEdited && (
            <TextBox variant='body' size='xs' opacity={0.6} fontStyle='italic'>
              edited
            </TextBox>
          )}
        </Flex>
      </Flex>
    </ContentBox>
  );
};
const ProposalMenuList = ({
  handleEditProposal,
  handleRestoreProposal,
  handleTogglePlaylist,
  formId,
  playlists,
  hasBeenEdited,
}) => {
  const formCentricPlaylistData = useMemo(() => {
    if (playlists) {
      return playlists?.map(list => ({
        ...list,
        isListed: list.forms.some(form => form === formId),
      }));
    }
  }, [playlists]);
  const isOnAnyList = useMemo(() => {
    if (formCentricPlaylistData) {
      const result = formCentricPlaylistData?.some(list => list.isListed);
      return result;
    }
  }, [formCentricPlaylistData]);

  const handleClickEdit = () => handleEditProposal(formId);
  const handleClickReset = () => handleRestoreProposal(formId);
  const handleClickToggle = e => {
    if (!e?.target?.value) return;
    const selectedList = formCentricPlaylistData.find(
      list => list.id === e.target.value,
    );
    handleTogglePlaylist(formId, selectedList.id, selectedList.isListed);
  };
  return (
    <Flex justifyContent='flex-end'>
      {isOnAnyList && (
        <Icon as={RiStarFill} color='white' w='20px' h='20px' mr={2} mt={1} />
      )}
      <Menu isLazy>
        <MenuButton alignItems='start'>
          <Icon
            as={RiMore2Line}
            color='white'
            w='20px'
            h='20px'
            cursor='pointer'
          />
        </MenuButton>
        <MenuList p={4}>
          <MenuItem
            onClick={handleClickEdit}
            icon={<Icon w='20px' h='20px' as={HiPencil} />}
          >
            Edit Proposal Details
          </MenuItem>
          <MenuItem
            onClick={handleClickReset}
            isDisabled={!hasBeenEdited}
            icon={<Icon w='20px' h='20px' as={HiRefresh} />}
          >
            Reset Proposal Details
          </MenuItem>
          <TextBox size='xs' p={3}>
            Add/Remove From Playlist
          </TextBox>
          {formCentricPlaylistData?.map(list => (
            <MenuItem
              key={list.id}
              icon={list.isListed ? <RiStarFill /> : <RiStarFill opacity={0} />}
              onClick={handleClickToggle}
              value={list.id}
            >
              {list.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};
const SelectorMenu = ({ onEdit, onDelete, id }) => {
  const handleClickEdit = e => {
    e.stopPropagation();
    onEdit(id);
  };
  const handleClickDelete = e => {
    e.stopPropagation();
    onDelete(id);
  };
  return (
    <Flex zIndex='10'>
      <Icon
        as={VscGear}
        color='secondary.400'
        w='20px'
        h='20px'
        mr={4}
        cursor='pointer'
        onClick={handleClickEdit}
      />
      <Icon
        as={FiTrash2}
        color='secondary.400'
        w='20px'
        h='20px'
        cursor='pointer'
        onClick={handleClickDelete}
      />
    </Flex>
  );
};
