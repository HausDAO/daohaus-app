import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  RiDiscordFill,
  RiTelegramFill,
  RiTwitterFill,
  RiGlobeLine,
  RiMediumFill,
  RiLinksLine,
} from 'react-icons/ri';
import { Flex, Image, Link, Icon, Stack, Badge } from '@chakra-ui/react';

import useCanInteract from '../hooks/useCanInteract';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { themeImagePath } from '../utils/metadata';
import { fixSocialLink } from '../utils/navLinks';

const DaoMetaOverview = ({ daoMetaData }) => {
  const { canInteract } = useCanInteract({});

  const { daochain, daoid } = useParams();

  return (
    <Flex as={ContentBox} mt={2} direction='column' w='100%'>
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
          {daoMetaData.tags && (
            <>
              <Flex mt={5}>
                <Stack direction='row'>
                  {daoMetaData.tags.map(tag => {
                    return <Badge key={tag}>{tag}</Badge>;
                  })}
                </Stack>
              </Flex>
            </>
          )}
          {canInteract && (
            <>
              <Link
                as={RouterLink}
                color='secondary.500'
                fontFamily='heading'
                fontSize='xs'
                textTransform='uppercase'
                letterSpacing='0.15em'
                to={`/dao/${daochain}/${daoid}/settings/meta`}
                mt={5}
                mb={3}
              >
                Edit Metadata
              </Link>
              <Link
                as={RouterLink}
                color='secondary.500'
                fontFamily='heading'
                fontSize='xs'
                textTransform='uppercase'
                letterSpacing='0.15em'
                to={`/dao/${daochain}/${daoid}/settings/theme`}
                mb={3}
              >
                Edit Custom Theme
              </Link>
              <Link
                as={RouterLink}
                color='secondary.500'
                fontFamily='heading'
                fontSize='xs'
                textTransform='uppercase'
                letterSpacing='0.15em'
                to={`/dao/${daochain}/${daoid}/settings/audit`}
              >
                View Metadata Edit Log
              </Link>
            </>
          )}
          {daoMetaData.name && (
            <Flex mt={3}>
              {daoMetaData.links?.website && (
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
              )}
              {daoMetaData.links?.discord && (
                <Link
                  href={fixSocialLink('discord', daoMetaData.links.discord)}
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
              {daoMetaData.links?.telegram && (
                <Link
                  href={fixSocialLink('telegram', daoMetaData.links.telegram)}
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
              {daoMetaData.links?.twitter && (
                <Link
                  href={fixSocialLink('twitter', daoMetaData.links.twitter)}
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
              {daoMetaData.links?.medium && (
                <Link
                  href={fixSocialLink('medium', daoMetaData.links.medium)}
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

              {daoMetaData.links?.other && (
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
              )}
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};

export default DaoMetaOverview;
