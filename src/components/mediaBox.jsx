import React, { memo } from 'react';
import ReactPlayer from 'react-player';
import { RiExternalLinkLine } from 'react-icons/ri';
import { Box, HStack, Icon, Image, Link } from '@chakra-ui/react';

import TextBox from './TextBox';

const hasImage = string => {
  const imageExtensions = ['.gif', '.jpg', '.png', '.svg', 'ipfs/Qm'];
  return imageExtensions.some(o => string.includes(o));
};

const hasHttp = string => {
  return string.indexOf('http') === 0;
};

const MediaBox = memo(({ link, width = '100%' }) => {
  if (link === '') return;
  if (hasImage(link)) {
    return (
      <Box width={width}>
        <Image
          src={hasHttp(link) ? link : `https://${link}`}
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
