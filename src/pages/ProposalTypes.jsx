import React, { useState } from 'react';

import { Box, Icon, Flex, Button, Text } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';
import { FiTrash2 } from 'react-icons/fi';
import { add } from 'date-fns/esm';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import { ALL_FORMS, CORE_FORMS, PLAYLISTS } from '../data/forms';
import { submitVoteTest } from '../polls/tests';
import { useOverlay } from '../contexts/OverlayContext';

const playlistActions = {
  edit() {},
  delete() {},
  add() {},
  // async submit() {},
};

const ProposalTypes = ({ customTerms }) => {
  const { displayFormModal } = useOverlay();
  const [playLists, setPlaylists] = useState(PLAYLISTS);
  const [selectedList, setSelectedList] = useState(ALL_FORMS);

  const selectList = value => {
    if (!value) return;
    if (value === 'all') {
      setSelectedList(ALL_FORMS);
    } else if (value === selectedList?.value) {
      setSelectedList(null);
    } else {
      setSelectedList(PLAYLISTS.find(list => list.value === value));
    }
  };

  const handleEditPlaylist = (e, value, params) => {
    e.stopPropagation();
    displayFormModal(CORE_FORMS.EDIT_PLAYLIST);
  };
  const handleDeletePlaylist = (e, value) => {
    e.stopPropagation();
    // displayFormModal(CONFIRMATION.DELETE_PLAYLIST);
  };
  const handleAddPlaylist = value => {
    console.log('fired');
    displayFormModal(CORE_FORMS.ADD_PLAYLIST);
  };

  return (
    <MainViewLayout isDao header='Proposal Types'>
      <Flex w='100%'>
        <PlaylistSelector
          allForms={ALL_FORMS}
          playlists={playLists}
          selectedList={selectedList}
          selectList={selectList}
          handleAddPlaylist={handleAddPlaylist}
          handleEditPlaylist={handleEditPlaylist}
          handleDeletePlaylist={handleDeletePlaylist}
        />
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
  handleAddPlaylist,
  handleEditPlaylist,
  handleDeletePlaylist,
}) => {
  return (
    <ContentBox p='0' minW='250px' maxW='400px' w='100%' border='none' mb={6}>
      <Flex flexDir='column'>
        <PlaylistItem
          {...allForms}
          selectList={selectList}
          isSelected={selectedList?.value === 'all'}
          isMutable={false}
        />
        <TextBox ml={6} my={6}>
          Playlists
        </TextBox>
        {playlists.map(list => (
          <PlaylistItem
            key={list.value}
            {...list}
            isMutable
            isSelected={selectedList?.value === list.value}
            selectList={selectList}
            handleEditPlaylist={handleEditPlaylist}
            handleDeletePlaylist={handleDeletePlaylist}
          />
        ))}
        <Button variant='outline' m={6}>
          <TextBox color='secondary.400'>create new list</TextBox>
        </Button>
      </Flex>
    </ContentBox>
  );
};

const PlaylistItem = ({
  name,
  forms,
  value,
  isMutable,
  isSelected,
  selectList,
  handleEditPlaylist,
  handleDeletePlaylist,
}) => {
  const displayActions = isSelected && isMutable;
  const handleClick = () => {
    selectList(value);
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
            color='primary.100'
            w='20px'
            h='20px'
            mr={4}
            cursor='pointer'
            onClick={handleEditPlaylist}
          />
          <Icon
            as={FiTrash2}
            color='primary.100'
            w='20px'
            h='20px'
            cursor='pointer'
            onClick={handleDeletePlaylist}
          />
        </Flex>
      )}
    </Flex>
  );
};
