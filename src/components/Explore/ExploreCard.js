import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Avatar, Box, Flex, Button, Badge } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import ContentBox from '../Shared/ContentBox';
import { themeImagePath } from '../../utils/helpers';

const ExploreCard = ({ dao }) => {
  if (dao.apiMetadata?.tags) {
    console.log('dao.apiMetadata.tags', dao.apiMetadata);
  }
  return (
    <>
      <ContentBox m={3} w='320px'>
        <Flex direction='row' align='center'>
          <Avatar
            src={
              dao.apiMetadata?.avatarImg
                ? themeImagePath(dao.apiMetadata.avatarImg)
                : makeBlockie(dao.id)
            }
            mr='10px'
          ></Avatar>
          <Box fontSize='xl' fontWeight={700} fontFamily='heading'>
            {dao.apiMetadata.name}
          </Box>
        </Flex>
        <Box fontSize='sm' mt={2}>
          {dao.apiMetadata.description}
        </Box>

        <Box fontSize='md' mt={2} fontFamily='heading'>
          $5
        </Box>
        <Flex direction='row' align='center'>
          <Box fontSize='sm' mr={3}>
            {dao.members.length} Members
          </Box>
          <Box fontSize='sm' mr={3}>
            |
          </Box>
          <Box fontSize='sm'>
            {dao.tokens.length} Token{dao.tokens.length > 1 ? 's' : ''}
          </Box>
        </Flex>
        <Badge colorScheme='red' variant='solid' mt={2} mb={2}>
          {dao.apiMetadata?.purpose}
        </Badge>
        {dao.apiMetadata?.tags ? (
          <Flex direction='row' wrap='wrap'>
            {dao.apiMetadata.tags.split(',').map((tag) => {
              return (
                <Badge
                  colorScheme='green'
                  variant='outline'
                  fontSize='9px'
                  mr={2}
                  mt={1}
                  key={tag}
                >
                  {tag}
                </Badge>
              );
            })}
          </Flex>
        ) : null}

        <Box mt={5}>
          <Button as={RouterLink} to={`/dao/${dao.id}`}>
            Go
          </Button>
        </Box>
      </ContentBox>
    </>
  );
};

export default ExploreCard;
