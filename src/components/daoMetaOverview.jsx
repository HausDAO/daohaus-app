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

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { themeImagePath } from '../utils/metadata';

const DaoMetaOverview = ({ daoMetaData }) => {
  return (
    <Flex as={ContentBox} mt={2} direction='column' w='100%%'>
      {daoMetaData && (
        <>
          <Flex>
            <Image
              src={
                daoMetaData.avatarImg
                  ? themeImagePath(daoMetaData.avatarImg)
                  : null
              }
              h='50px'
              w='50px'
            />
            <TextBox variant='value' size='xl' ml={4}>
              {daoMetaData.name}
            </TextBox>
          </Flex>
          <Flex mt={5}>{daoMetaData.description}</Flex>
          <Flex mt={5}>{daoMetaData.purpose}</Flex>
          {daoMetaData.tags ? (
            <>
              <Flex mt={5}>
                <Stack direction='row'>
                  {daoMetaData.tags.map(tag => {
                    return <Badge key={tag}>{tag}</Badge>;
                  })}
                </Stack>
              </Flex>
            </>
          ) : null}
          {daoMetaData.name && (
            <Flex mt={3}>
              {daoMetaData.links?.website ? (
                <Link
                  href={daoMetaData.links.website}
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
              {daoMetaData.links?.discord ? (
                <Link
                  href={daoMetaData.links.discord}
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
              {daoMetaData.links?.telegram ? (
                <Link
                  href={daoMetaData.links.telegram}
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
              {daoMetaData.links?.twitter ? (
                <Link
                  href={daoMetaData.links.twitter}
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
              {daoMetaData.links?.medium ? (
                <Link
                  href={daoMetaData.links.medium}
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

              {daoMetaData.links?.other ? (
                <Link
                  href={daoMetaData.links.other}
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
