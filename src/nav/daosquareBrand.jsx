import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Avatar } from '@chakra-ui/react';
import BrandImg from '../assets/img/Daohaus__Castle--Dark.svg';
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
      src={themeImagePath(BrandImg)}
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
