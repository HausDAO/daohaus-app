import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Avatar } from '@chakra-ui/react';
import D2Avatar from '../assets/img/d2_avatar.png';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { themeImagePath } from '../utils/metadata';

const DaosquareBrand = React.memo(() => {
  const { theme } = useCustomTheme();

  return (
    <Avatar
      d='block'
      as={RouterLink}
      to='/daosquare-incubator'
      size='md'
      cursor='pointer'
      border='none'
      src={themeImagePath(D2Avatar)}
      bg={theme.colors.primary}
      borderWidth='2px'
      borderStyle='solid'
      borderColor='transparent'
      _hover={{ border: `2px solid ${theme.colors.whiteAlpha[500]}` }}
      order={[1, null, null, 1]}
    />
  );
});

export default DaosquareBrand;
