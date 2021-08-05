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
          <Flex flexDir='column' justifyContent='space-between'>
            {menuSection}
            {/* <ProposalMenuList
              // handleEditProposal={handleEditProposal}
              // handleRestoreProposal={handleRestoreProposal}
              // handleTogglePlaylist={handleTogglePlaylist}
              // playlists={playlists}
              // formId={id}
              // hasBeenEdited={hasBeenEdited}
            /> */}
            {/* {hasBeenEdited && (
              <TextBox
                variant='body'
                size='xs'
                opacity={0.6}
                fontStyle='italic'
              >
                edited
              </TextBox>
            )} */}
          </Flex>
        </Flex>
      </ContentBox>
    </ChakraListItem>
  );
};

export default ListItem;
