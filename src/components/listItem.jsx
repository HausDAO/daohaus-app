import React from 'react';
import { Box, Flex, ListItem as ChakraListItem } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import TextBox from './TextBox';

const ListItem = ({
  customFormData,
  title,
  description,
  menuSection,
  helperText,
}) => {
  return (
    <ChakraListItem>
      <ContentBox mb={4} p={5}>
        <Flex justifyContent='space-between' flexDir={['column', 'row']}>
          {/* <Image h='70px' minW='70px' mb={6} /> */}
          <Box mb={3}>
            <TextBox mb={2} p={0}>
              {customFormData?.title || title}
            </TextBox>
            <Box fontFamily='body' size='sm' color='whiteAlpha.800'>
              {customFormData?.description || description}
            </Box>
          </Box>
          <Flex flexDir='column' alignItems={['flex-start', 'flex-end']}>
            {menuSection}
            {helperText && (
              <TextBox
                variant='body'
                mt={3}
                fontStyle='italic'
                opacity='0.8'
                size='sm'
              >
                {helperText}
              </TextBox>
            )}
          </Flex>
        </Flex>
      </ContentBox>
    </ChakraListItem>
  );
};

export default ListItem;
