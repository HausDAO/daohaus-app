import React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/core';

const TextBox = (props) => {
  const { size, variant, ...rest } = props;

  const styles = useStyleConfig('TextBoxComponent', { size, variant });

  return <Box sx={styles} {...rest} />;
};

export default TextBox;
