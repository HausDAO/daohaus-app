import React, { useContext } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Avatar, Box, Flex, Button, Badge, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import ContentBox from '../Shared/ContentBox';
import {
  numberWithCommas,
  pokemolUrl,
  themeImagePath,
} from '../../utils/helpers';
import { ExploreContext } from '../../contexts/ExploreContext';

const ExploreCard = ({ dao }) => {
  const { state, dispatch } = useContext(ExploreContext);

  const handleTagSelect = (tag) => {
    if (!state.tags.includes(tag.trim())) {
      const tagUpdate = [...state.tags, tag.trim()];
      dispatch({ type: 'updateTags', payload: tagUpdate });
    }
  };

  const renderTags = () => {
    if (dao.apiMetadata?.tags) {
      return (
        <Flex direction='row' wrap='wrap'>
          {dao.apiMetadata.tags.split(',').map((tag) => {
            return (
              <Badge
                key={tag}
                onClick={() => handleTagSelect(tag)}
                colorScheme='green'
                variant='outline'
                fontSize='9px'
                mr={2}
                mt={1}
                _hover={{
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                {tag}
              </Badge>
            );
          })}
        </Flex>
      );
    }
  };

  const renderLink = (dao) => {
    switch (dao.apiMetadata.version) {
      case '1': {
        return (
          <Button as={Link} href={pokemolUrl(dao)} isExternal>
            Go
          </Button>
        );
      }
      case '2':
      case '2.1': {
        return (
          <Button as={RouterLink} to={`/dao/${dao.id}`}>
            Go
          </Button>
        );
      }
      default: {
        return null;
      }
    }
  };
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
          {numberWithCommas(dao.guildBankValue.toFixed(2))}
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
        <Flex direction='row' align='center'>
          <Badge colorScheme='secondary' variant='solid' m='2px 2px 2px 0px'>
            {dao.apiMetadata?.purpose}
          </Badge>
          <Badge colorScheme='primary' variant='solid' m='2px 2px 2px 0px'>
            {dao.apiMetadata?.network}
          </Badge>
        </Flex>

        {renderTags()}

        <Box mt={5}>{renderLink(dao)}</Box>
      </ContentBox>
    </>
  );
};

export default ExploreCard;
