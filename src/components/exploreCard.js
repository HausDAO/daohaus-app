import React, { useContext } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Avatar, Box, Flex, Button, Badge, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ContentBox from './ContentBox';
import { ExploreContext } from '../contexts/ExploreContext';
import { pokemolUrlExplore, themeImagePath } from '../utils/metadata';
import { numberWithCommas } from '../utils/general';
import { chainByNetworkId } from '../utils/chain';

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
    if (dao.meta?.tags) {
      return (
        <Flex direction='row' wrap='wrap'>
          {dao.meta.tags.map((tag) => {
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
    switch (dao.meta.version) {
      case '1': {
        return (
          <Button
            minWidth='80px'
            as={Link}
            variant='outline'
            href={pokemolUrlExplore(dao)}
            isExternal
          >
            Go
          </Button>
        );
      }
      case '2':
      case '2.1': {
        return (
          <Button
            minWidth='80px'
            as={RouterLink}
            variant='outline'
            to={`/dao/${chainByNetworkId(dao.networkId).chain_id}/${dao.id}`}
          >
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
            dao.meta?.avatarImg
              ? themeImagePath(dao.meta.avatarImg)
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
          {dao.meta?.name}
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
        {dao.meta?.description}
      </Text>

      <Box fontSize='md' mt={2} fontFamily='heading'>
        ${numberWithCommas(dao.guildBankValue.toFixed(2))}
      </Box>
      <Flex direction='row' align='center'>
        <Box fontSize='sm' mr={3}>
          {dao.members.length === 100
            ? `${dao.members.length}+`
            : `${dao.members.length}`}{' '}
          Members
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
          {dao.meta?.purpose}
        </Badge>
        <Badge colorScheme='primary' variant='outline' m='3px 5px 3px 0px'>
          {dao.meta?.network}
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
