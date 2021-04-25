import { Box } from '@chakra-ui/react';
import React from 'react';
import TextBox from './TextBox';

const ToolTipLabel = ({ text }) => {
  return (
    <Box fontFamily='heading' p={5}>
      <TextBox mb={2}>{text?.title}</TextBox>
      {text?.pars?.length > 0 && text.pars.map((par) => (
        <Box mb={2} color='whiteAlpha.700'>
          {par}
        </Box>
      ))
  }
      {text?.body && <Box mb={2} color='whiteAlpha.700'>{text.body}</Box> }
    </Box>
  );
};

export default ToolTipLabel;
