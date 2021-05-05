import React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/react';

const TextBox = props => {
  const { size, variant, ...rest } = props;

  const styles = useStyleConfig('TextBoxComponent', {
    size,
    variant,
    ...rest,
  });

  return <Box sx={styles} {...rest} />;
};

export default TextBox;
