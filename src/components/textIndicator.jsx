import React from 'react';
import { Box, Skeleton } from '@chakra-ui/react';

import TextBox from './TextBox';
import { ToolTipWrapper } from '../staticElements/wrappers';
import { handlePossibleNumber } from '../utils/general';

const getLabelSize = size => {
  if (size === 'lg') return 'sm';
  if (size === 'sm') return 'xs';
  return 'xs';
};
const getTextSize = size => {
  if (size === 'lg') return '3xl';
  if (size === 'sm') return 'sm';

  return 'lg';
};

const TextIndicator = ({
  value,
  label,
  numString,
  fallback = '--',
  link,
  href,
  tooltip,
  tooltipText,
  size,
  comma = true,
  roundAmt = 4,
  append,
  onClick,
  isExternal,
}) => {
  const text = numString ? value : handlePossibleNumber(value, comma, roundAmt);

  return (
    <ToolTipWrapper
      link={link}
      href={href}
      isExternal={isExternal}
      tooltip={tooltip}
      tooltipText={tooltipText}
      onClick={onClick}
    >
      <Box mb={3}>
        <TextBox size={getLabelSize(size)}>{label}</TextBox>
        <Skeleton isLoaded={value}>
          <TextBox size={getTextSize(size)} variant='value'>
            {text || fallback} {append}
          </TextBox>
        </Skeleton>
      </Box>
    </ToolTipWrapper>
  );
};

export default TextIndicator;
