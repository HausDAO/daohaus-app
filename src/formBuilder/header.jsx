import React from 'react';
import TextBox from '../components/TextBox';

const Header = ({ headerText }) => {
  return (
    <TextBox size='lg' mb={6}>
      {headerText}
    </TextBox>
  );
};

export default Header;
