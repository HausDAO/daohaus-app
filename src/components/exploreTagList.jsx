import React, { useContext } from 'react';
import { Badge, Flex, Icon, Box } from '@chakra-ui/react';
import { FaRegWindowClose } from 'react-icons/fa';

import TextBox from './TextBox';
import { ExploreContext } from '../contexts/ExploreContext';

const ExploreTagList = () => {
  const { state, dispatch } = useContext(ExploreContext);

  const handleTagCancel = tag => {
    const tagUpdate = [...state.tags];
    tagUpdate.splice(tagUpdate.indexOf(tag), 1);
    dispatch({ type: 'updateTags', payload: tagUpdate });
  };
  return (
    <>
      {state.tags.length ? <TextBox size='xs'>Tags</TextBox> : null}
      {state.tags.map(tag => {
        return (
          <Badge
            key={tag}
            onClick={() => handleTagCancel(tag)}
            colorScheme='green'
            variant='outline'
            fontSize='10px'
            mr={2}
            mt={1}
            _hover={{
              cursor: 'pointer',
              color: 'white',
            }}
          >
            <Flex align='center'>
              <Box>{tag}</Box>
              <Icon as={FaRegWindowClose} />
            </Flex>
          </Badge>
        );
      })}
    </>
  );
};

export default ExploreTagList;
