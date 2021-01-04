import React from 'react';
import { Avatar, Flex, Image, Link, Icon } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import {
  RiDiscordFill,
  RiTelegramFill,
  RiTwitterFill,
  RiGlobeLine,
  RiMediumFill,
} from 'react-icons/ri';

import { useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';

const DaoMetaOverview = () => {
  const [dao] = useDao();
  const [theme] = useTheme();

  return (
    <Flex as={ContentBox} mt={2} direction='column' w='100%%'>
      {dao && (
        <>
          <Flex>
            {theme.images.avatarImg ? (
              <Avatar src={theme.images.avatarImg} h='50px' w='50px' />
            ) : (
              <Avatar
                h='50px'
                w='50px'
                name={dao.title.substr(0, 1)}
                src={makeBlockie(dao.id)}
              />
            )}
            <TextBox variant='value' size='xl' ml={4}>
              {dao.name}
            </TextBox>
          </Flex>
          <Flex mt={5}>{dao.description}</Flex>
          {dao.name && (
            <Flex mt={3}>
              {theme.daoMeta.website && (
                <Link
                  href={theme.daoMeta.website}
                  target='_blank'
                  rel='noreferrer noopener'
                  m={3}
                  ml={0}
                >
                  <Icon
                    as={RiGlobeLine}
                    h='30px'
                    w='30px'
                    color='secondary.500'
                  />
                </Link>
              )}
              {theme.daoMeta.discord && (
                <Link
                  href={theme.daoMeta.discord}
                  target='_blank'
                  rel='noreferrer noopener'
                  m={3}
                >
                  <Icon
                    as={RiDiscordFill}
                    h='30px'
                    w='30px'
                    color='secondary.500'
                  />
                </Link>
              )}
              {theme.daoMeta.telegram && (
                <Link
                  href={theme.daoMeta.telegram}
                  target='_blank'
                  rel='noreferrer noopener'
                  m={3}
                >
                  <Icon
                    as={RiTelegramFill}
                    h='30px'
                    w='30px'
                    color='secondary.500'
                  />
                </Link>
              )}
              {theme.daoMeta.twitter && (
                <Link
                  href={theme.daoMeta.twitter}
                  target='_blank'
                  rel='noreferrer noopener'
                  m={3}
                >
                  <Icon
                    as={RiTwitterFill}
                    h='30px'
                    w='30px'
                    color='secondary.500'
                  />
                </Link>
              )}
              {theme.daoMeta.medium && (
                <Link
                  href={theme.daoMeta.medium}
                  target='_blank'
                  rel='noreferrer noopener'
                  m={3}
                >
                  <Icon
                    as={RiMediumFill}
                    h='30px'
                    w='30px'
                    color='secondary.500'
                  />
                </Link>
              )}
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};

export default DaoMetaOverview;
