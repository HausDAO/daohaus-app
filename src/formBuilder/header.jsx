import React from 'react';

import TextBox from '../components/TextBox';

const Header = (props = {}) => {
  const { children } = props;
  return (
    <TextBox size='lg' mb={6} {...props}>
      {children}
    </TextBox>
  );
};

export default Header;
