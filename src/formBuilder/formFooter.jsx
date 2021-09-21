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
import { BsCheckCircle } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import ErrorList from './ErrorList';
import { useAppModal } from '../hooks/useModals';
import ProgressIndicator from '../components/progressIndicator';
import { HASH } from '../utils/general';

const indicatorStates = {
  loading: {
    spinner: true,
    title: 'Submitting...',
  },
  success: {
    icon: BsCheckCircle,
    title: 'Form Submitted',
  },
  error: {
    icon: BiErrorCircle,
    title: 'Error Submitting Transaction',
    description: HASH.ERROR_MESSAGE,
  },
};

const FormFooter = ({
  options,
  loading,
  addOption,
  errors,
  ctaText,
  customSecondaryBtn,
  customPrimaryBtn,
}) => {
  const { closeModal } = useAppModal();
  const defaultSecondary = { text: 'Cancel', fn: closeModal };

  const secondaryBtn = customSecondaryBtn || defaultSecondary;
  const indicatorState = 'loading';
  return (
    <Flex flexDir='column'>
      <ProgressIndicator
        states={indicatorStates}
        currentState={indicatorState}
      />
      <Flex
        mb={2}
        alignItems={['flex-row', 'flex-end']}
        flexDir={['column', 'row']}
      >
        {options?.length > 0 && (
          <AdditionalOptions
            mr='auto'
            options={options}
            addOption={addOption}
          />
        )}
        <Flex ml={['0', 'auto']}>
          <Button
            type='button'
            variant='outline'
            disabled={loading}
            onClick={secondaryBtn.fn}
            mr={2}
          >
            {secondaryBtn.text}
          </Button>

          <Button
            type={customPrimaryBtn ? 'button' : 'submit'}
            onClick={customPrimaryBtn && customPrimaryBtn?.fn}
            loadingText={customPrimaryBtn ? 'Loading' : 'Submitting'}
            isLoading={loading}
            disabled={loading || errors?.length}
          >
            {ctaText || customPrimaryBtn?.text || 'Submit'}
          </Button>
        </Flex>
      </Flex>
      <ErrorList errors={errors} />
    </Flex>
  );
};

export default FormFooter;

const AdditionalOptions = ({ options = [], addOption }) => {
  return (
    <Box mb={[2, 0]}>
      <Menu color='white' textTransform='uppercase'>
        <MenuButton
          as={Button}
          variant='outline'
          rightIcon={<Icon as={RiAddFill} />}
          type='button'
          mr={[0, 4]}
        >
          More
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
