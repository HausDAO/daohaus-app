import React from 'react';
import { useForm } from 'react-hook-form';

import { Box, Heading, Text, Button, Input, Textarea } from '@chakra-ui/react';

const HardModeForm = ({ daoData, handleSummon }) => {
  const { register, getValues, errors, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    defaultValues: { ...daoData },
  });
  const { isDirty, isValid, isSubmitted } = formState;

  const onSubmit = (data) => {
    console.log('data', data);
    handleSummon(data);
  };

  return (
    <Box className='HardModeForm'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete='off'
        className='Form'
      >
        <Box>
          <Heading as='h4'>Currency</Heading>
          <Box>
            What is the primary currency contract address? Can whitelist more
            here comma seperated.
            <Textarea
              className='inline-field'
              name='approvedToken'
              placeholder='0xd0a1e359811322d97991e03f863a0c30c2cf029c, 0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
              ref={register({ required: true })}
            />{' '}
            {errors.approvedToken?.type === 'required' && (
              <span className='required-field'>add a token address</span>
            )}
            <Text>
              How much should it cost to join (needs to be in wei - 18
              decimals)?
            </Text>
            <Input
              className='inline-field'
              name='minimumTribute'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />
            {errors.minimumTribute?.type === 'required' && (
              <span className='required-field'>required</span>
            )}
          </Box>
        </Box>

        <Box>
          <Heading as='h4'>Periods</Heading>
          <Box>
            How many seconds per period?
            <Input
              className='inline-field'
              name='periodDuration'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />
            {errors.periodDuration?.type === 'required' && (
              <span className='required-field'>required</span>
            )}
            {errors.periodDuration?.type === 'pattern' && (
              <span className='required-field'>not a number</span>
            )}
          </Box>
        </Box>

        <Box>
          <Heading as='h4'>Voting</Heading>
          <Text>How many periods will the voting period last?</Text>
          <Input
            className='inline-field'
            name='votingPeriod'
            ref={register({
              required: true,
              pattern: /^-?\d*\.?\d*$/,
            })}
          />{' '}
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
          />{' '}
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
          )}{' '}
        </Box>

        <Box>
          <Heading as='h4'>Deposits</Heading>
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
            )}{' '}
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
                  lessThanDeposit: (val) =>
                    val.length <= getValues('proposalDeposit').length,
                },
              })}
            />{' '}
            {errors.processingReward?.type === 'lessThanDeposit' && (
              <span className='required-field'>
                processing reward must be less than that proposal deposit
              </span>
            )}
            {errors.processingReward?.type === 'required' && (
              <span className='required-field'>required</span>
            )}
            {errors.processingReward?.type === 'pattern' && (
              <span className='required-field'>not a number</span>
            )}{' '}
          </Text>
          <Text>
            Summoners and shares. Enter one address and amount of shares on each
            line. Seperate address and amount with a space
            <Textarea
              className='inline-field'
              name='summonerAndShares'
              placeholder={`${daoData.summoner} 1`}
              ref={register({ required: true })}
            />{' '}
          </Text>
        </Box>
        <Box className='StepControl'>
          <Button
            type='submit'
            disabled={isSubmitted || (!isDirty && !isValid)}
          >
            SUMMON
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default HardModeForm;
