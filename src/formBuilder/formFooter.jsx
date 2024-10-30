import React from 'react';
import { RiAddFill } from 'react-icons/ri';
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

import ErrorList from './ErrorList';
import useCanInteract from '../hooks/useCanInteract';

const buttonTextByFormState = formState => {
  if (!formState) return;
  if (formState === 'idle') return 'Submit';
  if (formState === 'loading') return 'Submitting';
  if (formState === 'success') return 'Finish';
  if (formState === 'error') return 'Try Again';
};
const getPrimaryButtonFn = props => {
  const { customPrimaryBtn, closeModal, goToNext } = props;
  if (customPrimaryBtn?.fn) {
    return customPrimaryBtn.fn;
  }
  if (props.formState === 'success' && props.next && props.next !== 'FINISH') {
    return () => goToNext(props.next);
  }
  if (props.formState === 'success') {
    return closeModal;
  }
  return null;
};
const FormFooter = props => {
  const {
    options,
    loading,
    addOption,
    formState,
    errors,
    ctaText,
    customSecondaryBtn,
    customPrimaryBtn,
    handleAddStep,
    addStep,
    closeModal,
    checklist,
    disableCallback,
  } = props;
  const isLoading = loading === 'loading' || loading === 'loadingStepper';

  const defaultSecondary = { text: 'Cancel', fn: closeModal };
  const { canInteract, interactErrors } = useCanInteract({
    errorDeliveryType: 'softErrors',
    checklist,
  });
  const secondaryBtn = customSecondaryBtn || defaultSecondary;
  return (
    <Flex flexDir='column'>
      <Flex alignItems={['flex-row', 'flex-end']} flexDir={['column', 'row']}>
        {options?.length > 0 && (
          <AdditionalOptions
            mr='auto'
            options={options}
            addOption={addOption}
          />
        )}
        {addStep && <Button onClick={handleAddStep}>Add Step</Button>}
        <Flex
          ml={['0', 'auto']}
          w={['100%', 'inherit']}
          flexDir={['column-reverse', 'row']}
        >
          <Button
            type='button'
            variant='outline'
            disabled={isLoading}
            onClick={secondaryBtn.fn}
            mr={[0, 2]}
          >
            {secondaryBtn.text}
          </Button>

          <Button
            type={
              customPrimaryBtn || formState === 'success' ? 'button' : 'submit'
            }
            onClick={getPrimaryButtonFn(props)}
            loadingText={customPrimaryBtn ? 'Loading' : 'Submitting'}
            isLoading={isLoading}
            disabled={isLoading || !canInteract || disableCallback?.()}
            mb={[2, 0]}
          >
            {ctaText ||
              customPrimaryBtn?.text ||
              buttonTextByFormState(formState) ||
              'Submit'}
          </Button>
        </Flex>
      </Flex>
      {interactErrors && (
        <Flex justifyContent='flex-end' mt={4}>
          <ErrorList errors={interactErrors} />
        </Flex>
      )}
      {errors && (
        <Flex justifyContent='flex-end' mt={4}>
          <ErrorList errors={errors} />
        </Flex>
      )}
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
          w={['100%']}
        >
          <Box transform={['translateX(10px)', 'translateX(0)']}>More</Box>
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
