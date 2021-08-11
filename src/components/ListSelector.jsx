import { Flex } from '@chakra-ui/layout';
import React from 'react';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

const ListSelector = ({ lists, topListItem, divider, headerSection }) => {
  return (
    <Flex
      minW='250px'
      maxW='400px'
      w='100%'
      height='fit-content'
      flexDir='column'
      mr={12}
    >
      {headerSection}
      <ContentBox p='0' border='none' mb={6} w='100%'>
        <Flex flexDir='column'>
          {topListItem}
          {divider && (
            <TextBox ml={6} my={6}>
              {divider}
            </TextBox>
          )}
          {lists}
        </Flex>
      </ContentBox>
    </Flex>
  );
};

export default ListSelector;
