import React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/react';

const TextBox = (props) => {
  const { size, variant, colorScheme, ...rest } = props;

  const styles = useStyleConfig('TextBoxComponent', {
    size,
    variant,
    colorScheme,
  });

  return <Box sx={styles} {...rest} />;
};

export default TextBox;
