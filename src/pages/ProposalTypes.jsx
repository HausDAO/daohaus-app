import React, { useEffect, useState } from 'react';

import {
  Box,
  Icon,
  Flex,
  Button,
  MenuIcon,
  MenuList,
  useMenuList,
  Menu,
  MenuItem,
  MenuButton,
  MenuOptionGroup,
  MenuItemOption,
  Spinner,
} from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';
import { FiTrash2 } from 'react-icons/fi';

import { RiMore2Line, RiStarFill, RiStarLine } from 'react-icons/ri';
import { HiPencil } from 'react-icons/hi';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import { CORE_FORMS, FORM } from '../data/forms';

import { useConfirmation, useFormModal } from '../contexts/OverlayContext';
import {
  createPlaylist,
  defaultProposals,
  generatePlaylists,
} from '../utils/playlists';

import { useMetaData } from '../contexts/MetaDataContext';
import { isObjectEmpty } from '../utils/general';

const getFormPlaylists = playlists =>
  Object.keys(playlists).filter(key => playlists[key]);

const applyCustomData = (playlist, customData) => playlist;

const ProposalTypes = () => {
  const { daoProposals } = useMetaData();

  const { playlists, customData } = daoProposals || {};
  const [selectedList, setSelectedList] = useState(defaultProposals);

  const selectList = id => {
    if (!id) return;
    if (id === selectedList?.id) {
      setSelectedList(null);
    } else if (id === 'all') {
      setSelectedList(defaultProposals);
    } else {
      setSelectedList(playlists?.find(list => list.id === id));
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
          isSelected={selectedList?.id === 'all'}
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
            isSelected={selectedList?.id === list.id}
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
        // rounded='lg'
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

const ProposalList = ({ forms, playlists, toggleFavorite }) => {
  return (
    <Flex flexDir='column' w='60%'>
      {forms?.map(formId => (
        <ProposalListItem
          {...FORM[formId]}
          key={formId}
          allPlaylists={playlists}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </Flex>
  );
};

const ProposalListItem = ({ title, description, playlists, allPlaylists }) => {
  // const playlistList = getFormPlaylists(playlists);
  const { openFormModal, closeModal } = useFormModal();

  const handleEditProposal = () => {
    console.log('fired');
    openFormModal({ lego: CORE_FORMS.EDIT_PLAYLIST });
  };
  return (
    <ContentBox mb={4} maxW='1200px' minW='250px'>
      <Flex justifyContent='space-between'>
        {/* <Image h='70px' minW='70px' mb={6} /> */}
        <Box>
          <TextBox mb={2}>{title}</TextBox>
          <Box fontFamily='body' size='sm' color='whiteAlpha.800'>
            {description}
          </Box>
        </Box>
        <Flex>
          {/* {playlistList?.length > 0 && (
            <Icon
              as={RiStarFill}
              color='white'
              w='20px'
              h='20px'
              mt={1}
              mr={3}
              cursor='pointer'
            />
          )} */}
          <Menu>
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
                onClick={handleEditProposal}
                icon={<Icon w='20px' h='20px' as={HiPencil} />}
              >
                Edit Proposal Details
              </MenuItem>
              <TextBox size='xs' p={3}>
                Add/Remove From Playlist
              </TextBox>
              {allPlaylists?.map(list => (
                <MenuItem icon={<RiStarFill />} key={list.id}>
                  {list.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </ContentBox>
  );
};
