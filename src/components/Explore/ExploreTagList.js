import React, { useContext } from 'react';
import { Badge, Flex, Icon } from '@chakra-ui/react';
import { FaRegWindowClose } from 'react-icons/fa';

import { ExploreContext } from '../../contexts/ExploreContext';
import TextBox from '../Shared/TextBox';

const ExploreTagList = () => {
  const { state, dispatch } = useContext(ExploreContext);

  const handleTagCancel = (tag) => {
    const tagUpdate = [...state.tags];
    tagUpdate.splice(tagUpdate.indexOf(tag), 1);
    dispatch({ type: 'updateTags', payload: tagUpdate });
  };
  return (
    <>
      {state.tags.length ? <TextBox size='xs'>Tags</TextBox> : null}
      {state.tags.map((tag) => {
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
            <Flex direction='row' align='center'>
              {tag} <Icon as={FaRegWindowClose} />
            </Flex>
          </Badge>
        );
      })}
    </>
  );
};

export default ExploreTagList;
