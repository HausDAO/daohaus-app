import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { VscGear } from 'react-icons/vsc';
import { Icon, Flex, Button } from '@chakra-ui/react';

import TextBox from './TextBox';
import ListSelector from './ListSelector';
import ListSelectorItem from './ListSelectorItem';
import { isLastItem } from '../utils/general';

const PlaylistSelector = ({
  selectList,
  addPlaylist,
  allForms,
  selectedListID,
  playlists,
  deletePlaylist,
  editPlaylist,
  devList,
  dev,
}) => {
  return (
    <ListSelector
      selectList={selectList}
      headerSection={
        <Flex mb={4}>
          <Button variant='ghost' onClick={addPlaylist}>
            <TextBox mr={2} color='secondary.400'>
              New Playlist
            </TextBox>
          </Button>
        </Flex>
      }
      topListItem={
        <>
          {devList?.forms?.length > 0 && dev && (
            <ListSelectorItem
              lists={allForms?.forms}
              id='dev'
              isSelected={selectedListID === 'dev'}
              selectList={selectList}
              listLabel={{
                left: devList.name,
                right: devList?.forms?.length,
              }}
              isTop={devList}
            />
          )}
          <ListSelectorItem
            lists={allForms?.forms}
            id='all'
            isSelected={selectedListID === 'all'}
            selectList={selectList}
            listLabel={{
              left: 'Proposals',
              right: allForms?.forms?.length,
            }}
            isTop={!devList}
          />
        </>
      }
      divider='Playlists'
      lists={playlists?.map((list, index) => (
        <ListSelectorItem
          key={list.id}
          isSelected={list.id === selectedListID}
          listLabel={{ left: list.name, right: list.forms.length }}
          id={list.id}
          selectList={selectList}
          isBottom={isLastItem(playlists, index)}
          displayActions={
            list.id === selectedListID && (
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

export default PlaylistSelector;
