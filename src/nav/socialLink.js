import React from 'react';
import { Link, IconButton, Tooltip } from '@chakra-ui/react';

const SocialLink = ({ icon, href, label }) => {
  return (
    <Tooltip label={label} aria-label={label} placement='top' hasArrow>
      <IconButton
        as={Link}
        icon={icon}
        href={href}
        isExternal
        size='lg'
        variant='link'
        isRound='true'
      />
    </Tooltip>
  );
};

export default SocialLink;
