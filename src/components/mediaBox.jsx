import React, { memo } from 'react';
import { Box, HStack, Icon, Image, Link } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import ReactPlayer from 'react-player';

import TextBox from './TextBox';

const hasImage = string => {
  const imageExtensions = ['.jpg', '.png', '.gif'];
  return imageExtensions.some(o => string.includes(o));
};

const MediaBox = memo(({ link }) => {
  if (link === '') return;
  if (hasImage(link)) {
    console.log('render');
    return (
      <Box width='100%'>
        <Image
          src={`https://${link}`}
          maxW='100%'
          margin='0 auto'
          alt='link image'
        />
      </Box>
    );
  }
  if (ReactPlayer.canPlay(link)) {
    return (
      <Box width='100%'>
        <ReactPlayer url={link} playing={false} loop={false} width='100%' />
      </Box>
    );
  }
  return (
    <Box>
      <TextBox size='xs'>Link</TextBox>
      <HStack as={Link} href={`https://${link}`} target='_blank' spacing={2}>
        <Box>{link}</Box>
        <Icon as={RiExternalLinkLine} color='primary.50' />
      </HStack>
    </Box>
  );
});

export default MediaBox;
