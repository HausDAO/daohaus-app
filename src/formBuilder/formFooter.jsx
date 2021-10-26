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

import { useAppModal } from '../hooks/useModals';
import ErrorList from './ErrorList';

const FormFooter = ({
  options,
  loading,
  addOption,
  errors,
  ctaText,
  customSecondaryBtn,
  customPrimaryBtn,
  handleAddStep,
  addStep,
}) => {
  const { closeModal } = useAppModal();
  const defaultSecondary = { text: 'Cancel', fn: closeModal };

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
          // wrap={['wrap-reverse', 'wrap']}
          w={['100%', 'inherit']}
          flexDir={['column-reverse', 'row']}
        >
          <Button
            type='button'
            variant='outline'
            disabled={loading}
            onClick={secondaryBtn.fn}
            mr={[0, 2]}
          >
            {secondaryBtn.text}
          </Button>

          <Button
            type={customPrimaryBtn ? 'button' : 'submit'}
            onClick={customPrimaryBtn && customPrimaryBtn?.fn}
            loadingText={customPrimaryBtn ? 'Loading' : 'Submitting'}
            isLoading={loading}
            disabled={loading}
            mb={[2, 0]}
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
