import React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/core';

const BigText = (props) => {
  const { size, variant, ...rest } = props;

  const styles = useStyleConfig('BigText', { size, variant });

  return <Box as='text' sx={styles} {...rest} />;
};

export default BigText;
