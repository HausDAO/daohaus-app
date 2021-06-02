import React from 'react';
import { Box, Skeleton } from '@chakra-ui/react';
import TextBox from './TextBox';

import { ToolTipWrapper } from '../staticElements/wrappers';
import { handlePossibleNumber } from '../utils/general';

const TextIndicator = ({
  value,
  label,
  fallback = '--',
  link,
  tooltip,
  tooltipText,
  size,
  comma = true,
  roundAmt = 4,
  append,
}) => {
  const text = handlePossibleNumber(value, comma, roundAmt);
  return (
    <ToolTipWrapper link={link} tooltip={tooltip} tooltipText={tooltipText}>
      <Box mb={3}>
        <TextBox size={size === 'lg' ? 'sm' : 'xs'}>{label}</TextBox>
        <Skeleton isLoaded={value}>
          <TextBox size={size === 'lg' ? '3xl' : 'lg'} variant='value'>
            {text || fallback} {append}
          </TextBox>
        </Skeleton>
      </Box>
    </ToolTipWrapper>
  );
};

export default TextIndicator;
