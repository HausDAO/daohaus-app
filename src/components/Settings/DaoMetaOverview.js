import React from 'react';
import { Flex, Image, Link, Icon, Stack, Badge } from '@chakra-ui/react';
import {
  RiDiscordFill,
  RiTelegramFill,
  RiTwitterFill,
  RiGlobeLine,
  RiMediumFill,
  RiLinksLine,
} from 'react-icons/ri';

import { useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import { themeImagePath } from '../../utils/helpers';

const DaoMetaOverview = () => {
  const [dao] = useDao();
  const [theme] = useTheme();

  return (
    <Flex as={ContentBox} mt={2} direction='column' w='100%%'>
      {dao && (
        <>
          <Flex>
            <Image
              src={
                dao.avatarImg
                  ? themeImagePath(dao.avatarImg)
                  : theme.images.avatarImg
              }
              h='50px'
              w='50px'
            />
            <TextBox variant='value' size='xl' ml={4}>
              {dao.name}
            </TextBox>
          </Flex>
          <Flex mt={5}>{dao.description}</Flex>
          <Flex mt={5}>{dao.purpose}</Flex>
          {dao.tags ? (
            <>
              <Flex mt={5}>
                <Stack direction='row'>
                  {dao.tags.map((tag) => {
                    return <Badge key={tag}>{tag}</Badge>;
                  })}
                </Stack>
              </Flex>
            </>
          ) : null}
          {dao.name && (
            <Flex mt={3}>
              {dao.links?.website ? (
                <Link
                  href={dao.links.website}
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
              ) : null}
              {dao.links?.discord ? (
                <Link
                  href={dao.links.discord}
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
              ) : null}
              {dao.links?.telegram ? (
                <Link
                  href={dao.links.telegram}
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
              ) : null}
              {dao.links?.twitter ? (
                <Link
                  href={dao.links.twitter}
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
              ) : null}
              {dao.links?.medium ? (
                <Link
                  href={dao.links.medium}
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
              ) : null}

              {dao.links?.other ? (
                <Link
                  href={dao.links.other}
                  target='_blank'
                  rel='noreferrer noopener'
                  m={3}
                >
                  <Icon
                    as={RiLinksLine}
                    h='30px'
                    w='30px'
                    color='secondary.500'
                  />
                </Link>
              ) : null}
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};

export default DaoMetaOverview;
