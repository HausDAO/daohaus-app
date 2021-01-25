import React, { useContext } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Avatar, Box, Flex, Button, Badge, Link, Text } from '@chakra-ui/react';
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
    console.log('state.tags', state.tags, tag);
    if (!state.tags.includes(tag)) {
      const tagUpdate = [...state.tags, tag];
      dispatch({ type: 'updateTags', payload: tagUpdate });
    }
  };

  const renderTags = () => {
    if (dao.apiMetadata?.tags) {
      return (
        <Flex direction='row' wrap='wrap'>
          {dao.apiMetadata.tags.map((tag) => {
            return (
              <Badge
                key={tag}
                onClick={() => handleTagSelect(tag)}
                colorScheme='secondary.500'
                variant='outline'
                fontSize='9px'
                _notLast={{ marginRight: '3px' }}
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
          <Button minWidth='80px' as={Link} href={pokemolUrl(dao)} isExternal>
            Go
          </Button>
        );
      }
      case '2':
      case '2.1': {
        return (
          <Button minWidth='80px' as={RouterLink} to={`/dao/${dao.id}`}>
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
    <ContentBox
      w={['100%', '100%', '100%', '340px', '340px']}
      h='340px'
      mt={5}
      style={{ transition: 'all .15s linear' }}
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Flex direction='row' align='center' w='100%'>
        <Avatar
          src={
            dao.apiMetadata?.avatarImg
              ? themeImagePath(dao.apiMetadata.avatarImg)
              : makeBlockie(dao.id)
          }
          mr='10px'
          bg='primary'
        ></Avatar>
        <Box
          fontSize='xl'
          fontWeight={300}
          fontFamily='heading'
          lineHeight='1.125'
        >
          {dao.apiMetadata.name}
        </Box>
      </Flex>
      <Text
        fontSize='md'
        color='whiteAlpha.800'
        h='80px'
        my={3}
        style={{
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {dao.apiMetadata.description}
      </Text>

      <Box fontSize='md' mt={2} fontFamily='heading'>
        ${numberWithCommas(dao.guildBankValue.toFixed(2))}
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
      <Flex direction='row' align='center' mt={3}>
        <Badge colorScheme='secondary' variant='outline' m='3px 5px 3px 0px'>
          {dao.apiMetadata?.purpose}
        </Badge>
        <Badge colorScheme='primary' variant='outline' m='3px 5px 3px 0px'>
          {dao.apiMetadata?.network}
        </Badge>
      </Flex>

      {renderTags()}
      <Flex justify='flex-end' w='100%'>
        <Box mt={5}>{renderLink(dao)}</Box>
      </Flex>
    </ContentBox>
  );
};

export default ExploreCard;
