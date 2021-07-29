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
import { defaultProposals, getBoostPlaylists } from '../utils/playlists';

import { useMetaData } from '../contexts/MetaDataContext';
import { useDao } from '../contexts/DaoContext';

const ProposalTypes = () => {
  const { daoProposals } = useMetaData();

  const { playlists, customData } = daoProposals || {};
  const { daoOverview } = useDao();
  const [allPlaylists, setAllPlaylists] = useState(null);
  const [selectedList, setSelectedList] = useState('all');

  const selectList = id => {
    if (!id) return;
    if (id === selectedList) {
      setSelectedList(null);
    } else {
      setSelectedList(id);
    }
  };

  return (
    <MainViewLayout isDao header='Proposal Types'>
      <Flex w='auto'>
        {daoProposals ? (
          <>
            <PlaylistSelector
              allForms={defaultProposals}
              playlists={playlists}
              selectedList={selectedList}
              selectList={selectList}
            />
            <ProposalList
              forms={selectedList?.forms}
              playlists={playlists}
              customData={customData}
              selectedList={selectedList}
              // toggleFavorite={toggleFavorite}
            />
          </>
        ) : (
          <Spinner />
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default ProposalTypes;

const PlaylistSelector = ({
  allForms,
  playlists,
  selectedList,
  selectList,
}) => {
  const { openFormModal, closeModal } = useFormModal();
  const { openConfirmation } = useConfirmation();
  const { dispatchPropConfig } = useMetaData();

  const handleEditPlaylist = id => {
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

  const handleDeletePlaylist = id => {
    openConfirmation({
      title: 'Delete Playlist',
      header: `Are you sure you want to delete ${selectedList?.name}?`,
      onSubmit() {
        dispatchPropConfig({ action: 'DELETE_PLAYLIST', id });
        closeModal();
      },
    });
  };

  const handleAddPlaylist = () => {
    openFormModal({
      lego: CORE_FORMS.ADD_PLAYLIST,
      onSubmit: ({ values }) => {
        dispatchPropConfig({ action: 'ADD_PLAYLIST', name: values.title });
        closeModal();
      },
    });
  };

  return (
    <ContentBox
      p='0'
      minW='250px'
      maxW='400px'
      w='100%'
      border='none'
      mb={6}
      mr={12}
      height='fit-content'
    >
      <Flex flexDir='column'>
        <PlaylistItem
          {...allForms}
          selectList={selectList}
          isSelected={selectedList === 'all'}
          isMutable={false}
        />
        <TextBox ml={6} my={6}>
          Playlists
        </TextBox>
        {playlists?.map(list => (
          <PlaylistItem
            key={list.id}
            {...list}
            isMutable
            isSelected={selectedList === list.id}
            selectList={selectList}
            handleEditPlaylist={handleEditPlaylist}
            handleDeletePlaylist={handleDeletePlaylist}
          />
        ))}
        <Button variant='outline' m={6} onClick={handleAddPlaylist}>
          <TextBox color='secondary.400'>create new list</TextBox>
        </Button>
      </Flex>
    </ContentBox>
  );
};

const PlaylistItem = ({
  name,
  forms,
  id,
  isMutable,
  isSelected,
  selectList,
  handleEditPlaylist,
  handleDeletePlaylist,
}) => {
  const displayActions = isSelected && isMutable;
  const handleClick = () => {
    selectList(id);
  };
  const handleClickEdit = e => {
    e.stopPropagation();
    handleEditPlaylist(id);
  };
  const handleClickDelete = e => {
    e.stopPropagation();
    handleDeletePlaylist(id);
  };

  return (
    <Flex
      position='relative'
      p={6}
      flexDir='column'
      onClick={handleClick}
      transition='.2s all'
    >
      <Box
        position='absolute'
        top='0'
        right='0'
        left='0'
        bottom='0'
        zIndex='0'
        opacity='0.7'
        bg={isSelected ? 'primary.600' : 'transparent'}
        _hover={{ bg: 'primary.600' }}
      />
      <Flex
        justifyContent='space-between'
        mb={displayActions ? 2 : 0}
        zIndex='10'
        pointerEvents='none'
      >
        <TextBox textTransform='none' size='lg'>
          {name}
        </TextBox>
        <TextBox size='lg'>{forms?.length}</TextBox>
      </Flex>
      {displayActions && (
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
      )}
    </Flex>
  );
};

const ProposalList = ({
  playlists,
  toggleFavorite,
  customData,
  selectedList,
}) => {
  const { openFormModal, closeModal } = useFormModal();
  const { dispatchPropConfig } = useMetaData();

  const forms = useMemo(() => {
    if (!playlists || !selectedList) return [];
    if (selectedList === 'all') {
      return defaultProposals.forms;
    }
    return playlists.find(list => list.id === selectedList)?.forms;
  }, [selectedList, playlists]);

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
    openFormModal({
      lego: CORE_FORMS.EDIT_PROPOSAL,
      onSubmit: () => {
        dispatchPropConfig({ action: 'EDIT_PROPOSAL', formId });
        closeModal();
      },
    });
  };

  const handleTogglePlaylist = (formId, listId, isListed) => {
    dispatchPropConfig({ action: 'TOGGLE_PLAYLIST', listId, formId, isListed });
  };

  return (
    <Flex flexDir='column' w='60%'>
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
  return (
    <ContentBox mb={4} maxW='1200px' minW='250px'>
      <Flex justifyContent='space-between'>
        {/* <Image h='70px' minW='70px' mb={6} /> */}
        <Box>
          <TextBox mb={2}>{customFormData?.title || title}</TextBox>
          <Box fontFamily='body' size='sm' color='whiteAlpha.800'>
            {customFormData?.description || description}
          </Box>
        </Box>
        <Flex>
          <ProposalMenuList
            handleEditProposal={handleEditProposal}
            handleRestoreProposal={handleRestoreProposal}
            handleTogglePlaylist={handleTogglePlaylist}
            playlists={playlists}
            formId={id}
          />
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
}) => {
  const formCentricPlaylistData = useMemo(() => {
    if (playlists) {
      return playlists?.map(list => ({
        ...list,
        isListed: list.forms.some(form => form === formId),
      }));
    }
  }, [playlists]);
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
  );
};
