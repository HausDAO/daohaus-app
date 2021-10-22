import React, { useMemo } from 'react';
import { RiInformationLine } from 'react-icons/ri';
import { Box, Flex, FormHelperText, FormLabel, Icon } from '@chakra-ui/react';

import TextBox from '../components/TextBox';
import ErrorList from './ErrorList';
import { ToolTipWrapper } from '../staticElements/wrappers';

const FieldWrapper = ({
  children,
  label,
  info,
  htmlFor,
  name,
  helperText,
  hidden,
  btn,
  errors = {},
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

  // const errorMsgs = useMemo(() => {
  //   if (!errors[name]) return;

  //   return Object.values(errors[name]);
  // }, [errors, name]);
  // console.log(`errorMsgs`, errorMsgs);
  const fieldError = errors[name];
  return (
    <Flex
      w={width}
      mb={mb || 3}
      flexDir='column'
      {...containerProps}
      hidden={hidden}
    >
      <Flex>
        <TextBox
          as={FormLabel}
          size='xs'
          htmlFor={htmlFor || name}
          position='relative'
        >
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
      {fieldError && <ErrorList singleError={fieldError} />}
    </Flex>
  );
};

export default FieldWrapper;
