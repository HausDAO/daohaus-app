import React from 'react';
import { Box, Flex, FormHelperText, FormLabel, Icon } from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import TextBox from '../components/TextBox';
import { SubmitFormError } from './staticElements';
import { ToolTipWrapper } from '../staticElements/wrappers';

const FieldWrapper = ({
  children,
  label,
  info,
  htmlFor,
  helperText,
  btn,
  error,
  required,
  containerProps,
  mb,
  w,
}) => {
  return (
    <Flex
      w={w || ['100%', null, '48%']}
      mb={mb || 3}
      flexDir='column'
      {...containerProps}
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
      {error && <SubmitFormError message={error.message} />}
    </Flex>
  );
};

export default FieldWrapper;
