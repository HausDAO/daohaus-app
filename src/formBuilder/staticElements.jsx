import React from 'react';
import { RiAddFill, RiErrorWarningLine } from 'react-icons/ri';
import { TiWarningOutline } from 'react-icons/ti';
import {
  Button,
  Box,
  Flex,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

// import TextBox from '../components/TextBox';

export const ErrorList = ({ errors = [] }) => {
  //  determine which errors are submit errors

  return (
    <Flex flexDirection='column' alignItems='flex-start'>
      {errors.map((error, index) => (
        <SubmitFormError
          message={error.message}
          key={`${error.message}-${index}`}
        />
      ))}
    </Flex>
  );
};

export const FormMessage = ({ message, icon }) => (
  <Flex color='secondary.300' fontSize='m' alignItems='flex-start'>
    <Icon as={icon} color='secondary.300' mr={1} transform='translateY(2px)' />
    {message}
  </Flex>
);

export const SubmitFormError = ({ message }) => (
  <FormMessage message={message} icon={RiErrorWarningLine} />
);

export const WarningMessage = ({ message }) => (
  <FormMessage message={message} icon={TiWarningOutline} />
);

export const ModButton = ({ label, callback }) => (
  <Button onClick={callback} variant='outline' size='xs'>
    {label}
  </Button>
);

export const FormFooter = ({
  options,
  loading,
  addOption,
  errors,
  ctaText,
  secondaryBtn,
  warningMsg,
}) => {
  if (options?.length) {
    return (
      <Box>
        {warningMsg && <WarningMessage message={warningMsg} />}
        <Flex alignItems='flex-end' flexDir='column'>
          <Flex mb={2}>
            <AdditionalOptions
              mr='auto'
              options={options}
              addOption={addOption}
            />
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading || errors?.length}
              borderBottomLeftRadius='0'
              borderTopLeftRadius='0'
            >
              {ctaText || 'Submit'}
            </Button>
          </Flex>
          <ErrorList errors={errors} />
        </Flex>
      </Box>
    );
  }
  return (
    <Box>
      {warningMsg && <WarningMessage message={warningMsg} />}
      <Flex justifyContent='flex-end'>
        <Flex>
          {secondaryBtn && (
            <Button
              type='button'
              variant='outline'
              disabled={loading}
              onClick={secondaryBtn.fn}
              mr={4}
            >
              {secondaryBtn.text}
            </Button>
          )}
          <Button
            type='submit'
            loadingText='Submitting'
            isLoading={loading}
            disabled={loading || errors?.length}
          >
            {ctaText || 'Submit'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export const AdditionalOptions = ({ options = [], addOption }) => {
  return (
    <Box>
      <Menu color='white' textTransform='uppercase'>
        <MenuButton
          as={Button}
          variant='outline'
          rightIcon={<Icon as={RiAddFill} />}
          borderTopRightRadius='0'
          borderBottomRightRadius='0'
          type='button'
        >
          Additional Options
        </MenuButton>
        <MenuList>
          {options?.map(option => {
            return (
              <MenuItem
                key={option.htmlFor}
                onClick={addOption}
                value={option.htmlFor}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
};

// const FormErrorList = formErrorStore => {
//   return formErrorStore.map(error => (
//     <TextBox key='error' variant='body'>
//       {error}
//     </TextBox>
//   ));
// };
