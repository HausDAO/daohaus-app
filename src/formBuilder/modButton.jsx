import React from 'react';
import { Button } from '@chakra-ui/react';

const ModButton = ({ text, fn }) => (
  <Button onClick={fn} variant='outline' size='xs'>
    {text}
  </Button>
);

export default ModButton;
