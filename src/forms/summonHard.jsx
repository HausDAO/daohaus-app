import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Text,
  Button,
  Input,
  Textarea,
  Icon,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import { RiErrorWarningLine, RiInformationLine } from 'react-icons/ri';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { validateSummonresAndShares } from '../utils/summoning';
import TimeInput from '../components/timeInput';

const SummonHard = ({ daoData, handleSummon, networkName, isUberHaus }) => {
  const [currentError, setCurrentError] = useState(null);
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    mode: 'onBlur',
    defaultValues: { ...daoData },
  });
  const [timePeriodInSeconds, setTimePeriod] = useState('');
  const { isDirty, isValid } = formState;

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
    reset({
      ...daoData,
    });
  }, [daoData]);

  const onSubmit = data => {
    handleSummon({ ...data, seconds: timePeriodInSeconds?.toString() });
  };

  return (
    <ContentBox maxWidth='600px'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete='off'
        className='Form'
      >
        <Box>
          <Flex mb={4}>
            <TextBox>
              Summoning on:
              {networkName}
            </TextBox>
            <Tooltip
              label={
                <Box fontFamily='heading'>
                  If you would like to summon on a different network, switch
                  networks on your wallet
                </Box>
              }
              transform='translateY(-10px)'
              bg='secondary.500'
              placement='right'
            >
              <Flex alignItems='center' ml={2}>
                <Icon as={RiInformationLine} />
              </Flex>
            </Tooltip>
          </Flex>

          <TextBox>Token(s)</TextBox>
          <Box>
            <Box>
              What is the primary token contract address? Can whitelist more
              here as well, separated by a comma and a space (0x58eb...,
              0xf7s4..., etc). The first one will be the primary token.
            </Box>
            {isUberHaus ? (
              <Box my={5} color='secondary.500'>
                We have pre-filled this with the the wrapped native token for
                the network and the HAUS token.
              </Box>
            ) : null}
            <Textarea
              className='inline-field'
              name='approvedToken'
              placeholder='0xd0a1e359811322d97991e03f863a0c30c2cf029c, 0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
              ref={register({ required: true })}
            />
            {errors.approvedToken?.type === 'required' && (
              <span className='required-field'>add a token address</span>
            )}
          </Box>
        </Box>
        {/* {isCloning && daochain !== } */}
        <Box>
          <TextBox mt={6}>Periods</TextBox>
          <TimeInput
            errors={errors}
            register={register}
            watch={watch}
            setError={setError}
            setValue={setValue}
            clearErrors={clearErrors}
            setTimePeriod={setTimePeriod}
            inputName='periodDuration'
          />
        </Box>
        <Box>
          <TextBox mt={6}>Voting</TextBox>
          <Text>How many periods will the voting period last?</Text>
          <Input
            className='inline-field'
            name='votingPeriod'
            ref={register({
              required: true,
              pattern: /^-?\d*\.?\d*$/,
            })}
          />
          {errors.votingPeriod?.type === 'required' && (
            <span className='required-field'>required</span>
          )}
          {errors.votingPeriod?.type === 'pattern' && (
            <span className='required-field'>not a number</span>
          )}
          <Text>How many periods will the grace period last?</Text>
          <Input
            className='inline-field'
            name='gracePeriod'
            ref={register({
              required: true,
              pattern: /^-?\d*\.?\d*$/,
            })}
          />
          {errors.gracePeriod?.type === 'required' && (
            <span className='required-field'>required</span>
          )}
          {errors.gracePeriod?.type === 'pattern' && (
            <span className='required-field'>not a number</span>
          )}
          <Text>What will be the dilution bound?</Text>
          <Input
            className='inline-field'
            name='dilutionBound'
            ref={register({
              required: true,
              pattern: /^-?\d*\.?\d*$/,
            })}
          />
          {errors.dilutionBound?.type === 'required' && (
            <span className='required-field'>required</span>
          )}
          {errors.dilutionBound?.type === 'pattern' && (
            <span className='required-field'>not a number</span>
          )}
        </Box>

        <Box>
          <TextBox mt={6}>Deposits</TextBox>
          <Text>
            How much is the proposal deposit (needs to be in wei - 18 decimals)?
            <Input
              className='inline-field'
              name='proposalDeposit'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />
            {errors.proposalDeposit?.type === 'required' && (
              <span className='required-field'>required</span>
            )}
            {errors.proposalDeposit?.type === 'pattern' && (
              <span className='required-field'>not a number</span>
            )}
          </Text>
          <Text>
            How much is the processing reward?
            <Input
              className='inline-field'
              name='processingReward'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
                validate: {
                  lessThanDeposit: val =>
                    val.length <= getValues('proposalDeposit').length,
                },
              })}
            />
            {errors.processingReward?.type === 'lessThanDeposit' && (
              <span className='required-field'>
                processing reward must be less than proposal deposit
              </span>
            )}
            {errors.processingReward?.type === 'required' && (
              <span className='required-field'>required</span>
            )}
            {errors.processingReward?.type === 'pattern' && (
              <span className='required-field'>not a number</span>
            )}
          </Text>
          <TextBox mt={6}>Summoners and starting shares</TextBox>
          <Text>
            Enter one address and amount of shares on each line. Separate
            address and amount with a space. Be sure to include yourself as
            desired.
            <Textarea
              className='inline-field'
              name='summonerAndShares'
              placeholder={`${daoData.summoner} 1`}
              ref={register({
                required: true,
                validate: {
                  invalidList: value => {
                    const errMsg = validateSummonresAndShares(value);
                    return errMsg;
                  },
                },
              })}
            />
          </Text>
        </Box>
        <Box className='StepControl'>
          {currentError && (
            <Box color='red.500' fontSize='m' mr={5}>
              <Icon as={RiErrorWarningLine} color='red.500' mr={2} />
              {currentError.message}
            </Box>
          )}
          <Button type='submit' disabled={!isDirty && !isValid}>
            SUMMON
          </Button>
        </Box>
      </form>
    </ContentBox>
  );
};

export default SummonHard;
