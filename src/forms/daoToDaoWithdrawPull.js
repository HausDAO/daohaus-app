import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  Flex,
  Icon,
  Box,
  useBreakpointValue,
  Select,
  FormLabel,
  InputGroup,
  Input,
  FormHelperText,
} from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import { useOverlay } from '../contexts/OverlayContext';
// import { detailsToJSON } from '../utils/general';
import styled from '@emotion/styled';
import {
  UBERHAUS_STAKING_TOKEN,
  UBERHAUS_STAKING_TOKEN_SYMBOL,
} from '../utils/uberhaus';
import TextBox from '../components/TextBox';
import { useParams } from 'react-router-dom';

const FormWrapper = styled.form`
  width: 100%;
`;

const getCurrentMobileForm = (currentView) => {
  return currentView === 'withdraw' ? <WithdrawForm /> : <PullForm />;
};

const BothForms = () => (
  <>
    <WithdrawForm />
    <PullForm />
  </>
);

const WithdrawPullForm = () => {
  const [currentView, setCurrentView] = useState('withdraw');

  const mobileForm = getCurrentMobileForm(currentView);
  const formLayout = useBreakpointValue({
    lg: <BothForms />,
    md: mobileForm,
    sm: mobileForm,
    base: mobileForm,
  });

  const switchView = (e) => {
    if (e?.target?.value) {
      setCurrentView(e.target.value);
    }
  };

  return (
    <Flex width='100%' mt={-4} flexDirection={['column', null, null, 'row']}>
      <Flex mb={6} display={['flex', null, null, 'none']}>
        <Button
          size='sm'
          variant={currentView === 'withdraw' ? 'solid' : 'outline'}
          value='withdraw'
          onClick={switchView}
          borderRadius='6px 0 0 6px'
          _hover={{ scale: '1' }}
          outline='none'
        >
          Withdraw
        </Button>
        <Button
          size='sm'
          variant={currentView === 'pull' ? 'solid' : 'outline'}
          value='pull'
          onClick={switchView}
          borderRadius='0 6px 6px 0'
          _hover={{ scale: '1' }}
          outline='none'
        >
          Pull
        </Button>
      </Flex>
      {formLayout}
    </Flex>
  );
};

export default WithdrawPullForm;

const WithdrawForm = () => {
  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const { setD2dProposalModal } = useOverlay();
  const { daoid } = useParams();

  const { handleSubmit, errors, register } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newE = Object.keys(errors)[0];
      setCurrentError({
        field: newE,
        ...errors[newE],
      });
    } else {
      setCurrentError(null);
    }
  }, [errors]);

  useEffect(() => {
    // getMax value
  }, [daoid]);

  const onSubmit = () => {
    setLoading(true);

    setD2dProposalModal((prevState) => !prevState);
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
        p={0}
        flexWrap='wrap'
        width='100%'
        px={8}
        borderRight={['none', null, null, '1px solid rgba(255,255,255,0.2)']}
      >
        <Flex flexDirection='column'>
          <Box
            color='#C4C4C4'
            mb={2}
            fontFamily='heading'
            fontWeight={900}
            fontSize='2xl'
          >
            Withdraw
          </Box>
          <Box color='#C4C4C4' mb={4}>
            Withdraw tokens into the minion
          </Box>
        </Flex>
        <Box w='100%'>
          <TokenSelect
            selectProps={{ mb: '6' }}
            label='Token'
            id='withdrawSelect'
            name='withdrawToken'
            register={register}
          />
          <MaxOutInput
            register={register}
            max='10'
            label='Withdraw'
            name='withdraw'
            id='withdraw'
          />
          <Flex justify='center' mt={8}>
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading}
            >
              Submit
            </Button>
            {currentError && (
              <Box color='secondary.300' fontSize='m' mt={4}>
                <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
                {currentError.message}
              </Box>
            )}
          </Flex>
        </Box>
      </FormControl>
    </FormWrapper>
  );
};

const PullForm = () => {
  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  // const { setD2dProposalModal } = useOverlay();

  const { handleSubmit, errors, register } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newE = Object.keys(errors)[0];
      setCurrentError({
        field: newE,
        ...errors[newE],
      });
    } else {
      setCurrentError(null);
    }
  }, [errors]);

  const onSubmit = (values) => {
    setLoading(true);
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
        flexWrap='wrap'
        px={8}
      >
        <Flex flexDirection='column'>
          <Box
            color='#C4C4C4'
            mb={2}
            fontFamily='heading'
            fontWeight={900}
            fontSize='2xl'
          >
            Pull Guild Funds
          </Box>
          <Box color='#C4C4C4' mb={4}>
            Transfer funds from minion to your DAO
          </Box>
        </Flex>
        <Box w='100%'>
          <TokenSelect
            selectProps={{ mb: '6' }}
            label='Token'
            id='PullSelect'
            name='pullToken'
            register={register}
          />
          <MaxOutInput
            register={register}
            max='10'
            label='Withdraw'
            name='withdraw'
            id='withdraw'
          />
          <Flex justify='center' mt={8}>
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading}
            >
              Submit
            </Button>
            {currentError && (
              <Box color='secondary.300' fontSize='m' mt={4}>
                <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
                {currentError.message}
              </Box>
            )}
          </Flex>
        </Box>
      </FormControl>
    </FormWrapper>
  );
};

const temporaryTokenOptions = [
  { name: UBERHAUS_STAKING_TOKEN_SYMBOL, value: UBERHAUS_STAKING_TOKEN },
];
const TokenSelect = ({
  selectProps = {},
  label = 'token',
  id,
  register,
  name,
}) => {
  return (
    <Box>
      <TextBox as={FormLabel} size='xs' htmlFor={id} mb={2}>
        {label}
      </TextBox>
      <Select
        {...selectProps}
        id={id}
        ref={register}
        name={name}
        placeholder='--Select Token--'
        color='whiteAlpha.900'
      >
        {temporaryTokenOptions.map((token) => (
          <option key={token.value} value={token.value}>
            {token.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

const MaxOutInput = ({
  label = 'labelPlaceholder',
  setMax,
  register,
  name,
  helperText,
  max,
  id,
  containerProps = {},
  validationPattern = {},
}) => {
  return (
    <Box {...containerProps}>
      <TextBox as={FormLabel} size='xs' htmlFor={id} mb={2}>
        {label}
      </TextBox>
      <InputGroup>
        <Button
          onClick={setMax}
          size='xs'
          position='absolute'
          right='0'
          top='-30px'
          variant='outline'
        >
          Max: {max}
        </Button>
        <Input
          name={name}
          placeholder='0'
          id={id}
          ref={register({
            pattern: validationPattern,
          })}
          color='white'
          focusBorderColor='secondary.500'
        />
      </InputGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </Box>
  );
};
