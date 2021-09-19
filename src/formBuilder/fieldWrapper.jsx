import React, { useMemo } from 'react';
import { Box, Flex, FormHelperText, FormLabel, Icon } from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import TextBox from '../components/TextBox';
import ErrorList from './ErrorList';
import { ToolTipWrapper } from '../staticElements/wrappers';

const FieldWrapper = ({
  children,
  label,
  info,
  htmlFor,
  helperText,
  hidden,
  btn,
  error,
  required,
  containerProps,
  mb,
  layout,
  w,
}) => {
  const width = useMemo(() => {
    if (w) return w;
    // if (layout === 'singleRow') return '100%';
    // return ['100%', null, '48%'];
  }, [w, layout]);
  return (
    <Flex
      w={width}
      mb={mb || 3}
      flexDir='column'
      {...containerProps}
      hidden={hidden}
    >
      <Flex>
        <TextBox as={FormLabel} size='xs' htmlFor={htmlFor} position='relative'>
          {required && (
            <Box display='inline' position='absolute' left='-1rem'>
              {'* '}
            </Box>
          )}
          {label}
          {info && (
            <ToolTipWrapper
              tooltip
              tooltipText={{ body: info }}
              placement='right'
              layoutProps={{
                transform: 'translateY(-2px)',
                display: 'inline-block',
              }}
            >
              <Icon as={RiInformationLine} ml={2} />
            </ToolTipWrapper>
          )}
        </TextBox>
        {btn && <Flex ml='auto'>{btn}</Flex>}
      </Flex>

      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {error && <ErrorList singleError={error} />}
    </Flex>
  );
};

export default FieldWrapper;
