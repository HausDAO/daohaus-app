import React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/react';

const ContentBox = props => {
  const { size, variant, ...rest } = props;

  const styles = useStyleConfig('ContentBoxComponent', {
    size,
    variant,
    ...rest,
  });

  return <Box sx={styles} {...rest} />;
};

export default ContentBox;
