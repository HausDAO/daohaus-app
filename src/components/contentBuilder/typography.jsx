import React from 'react';
import TextBox from '../TextBox';

export const Label = ({ text, children }) => (
  <TextBox size='sm'>{text || children}</TextBox>
);
export const Heading = ({ text, children }) => (
  <TextBox size='md' variant='label'>
    {text || children}
  </TextBox>
);
export const Paragraph = ({ text, children }) => (
  <TextBox>{text || children}</TextBox>
);
