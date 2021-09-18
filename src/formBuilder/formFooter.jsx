import React from 'react';
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
import { RiAddFill } from 'react-icons/ri';
import ErrorList from './ErrorList';

export const FormFooter = ({
  options,
  loading,
  addOption,
  errors,
  ctaText,
  secondaryBtn,
}) => {
  if (options?.length) {
    return (
      <Box>
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
          type='button'
          mr={4}
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
