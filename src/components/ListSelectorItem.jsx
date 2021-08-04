import { Box, Flex } from '@chakra-ui/layout';
import React from 'react';
import TextBox from './TextBox';

const ListSelectorItem = ({
  selectList,
  isSelected,
  displayActions,
  listLabel = { name: 'listname', length: 0 },
  customLabel,
  id,
}) => {
  const handleSelectList = () => selectList(id);
  return (
    <Flex
      position='relative'
      p={6}
      flexDir='column'
      onClick={handleSelectList}
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
      {listLabel && (
        <Flex
          justifyContent='space-between'
          mb={displayActions ? 2 : 0}
          zIndex='10'
          pointerEvents='none'
        >
          <TextBox textTransform='none' size='lg'>
            {listLabel?.name}
          </TextBox>
          <TextBox size='lg'>{listLabel?.length}</TextBox>
        </Flex>
      )}
      {customLabel}
      {displayActions}
    </Flex>
  );
};

/* <ListItem
    {...topList}
    selectList={selectList}
    isSelected={selectedList === topList.id}
    isMutable={false}
  />;

{
  lists?.map(list => (
    <ListItem
      key={list.id}
      {...list}
      isMutable
      isSelected={selectedList === list.id}
      selectList={selectList}
      handleEditPlaylist={handleEditPlaylist}
      handleDeletePlaylist={handleDeletePlaylist}
    />
  ));
} */

export default ListSelectorItem;
