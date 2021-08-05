import React from 'react';
import { Box, Flex, ListItem as ChakraListItem } from '@chakra-ui/react';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

const ListItem = ({ customFormData, title, description, menuSection }) => {
  return (
    <ChakraListItem>
      <ContentBox mb={4}>
        <Flex justifyContent='space-between'>
          {/* <Image h='70px' minW='70px' mb={6} /> */}
          <Box>
            <TextBox mb={2}>{customFormData?.title || title}</TextBox>
            <Box fontFamily='body' size='sm' color='whiteAlpha.800'>
              {customFormData?.description || description}
            </Box>
          </Box>
          {menuSection}
        </Flex>
      </ContentBox>
    </ChakraListItem>
  );
};

export default ListItem;
