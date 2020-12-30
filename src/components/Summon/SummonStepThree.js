import React from 'react';
import { useForm } from 'react-hook-form';

import { Box, Text, Heading, Button, Input, Textarea } from '@chakra-ui/react';
import { RiArrowLeftFill } from 'react-icons/ri';

import {
  periodsForForm,
  periodsFromForm,
  depositsForForm,
  depositsFromForm,
} from '../../utils/helpers';
import { currencyOptions } from '../../content/summon-presets';
import { useNetwork } from '../../contexts/PokemolContext';

const SummonStepThree = ({
  daoData,
  setDaoData,
  setCurrentStep,
  handleSummon,
}) => {
  const [network] = useNetwork();
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    errors,
    formState,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      ...daoData,
      formattedPeriods: periodsForForm(daoData),
      formattedDeposits: depositsForForm(daoData),
    },
  });

  const { isDirty, isValid, isSubmitted } = formState;

  const watchPeriodFields = watch([
    'formattedPeriods.votingPeriod',
    'formattedPeriods.gracePeriod',
  ]);

  const watchDepositFields = watch([
    'formattedDeposits.proposalDeposit',
    'formattedDeposits.processingReward',
  ]);

  const onSubmit = (data) => {
    const newDataData = {
      ...getValues(),
      ...periodsFromForm(watchPeriodFields, daoData.periodDuration),
      ...depositsFromForm(watchDepositFields),
    };
    setDaoData((prevState) => {
      return {
        ...prevState,
        ...newDataData,
      };
    });
    handleSummon(newDataData);
  };

  const navigate = (step) => {
    setDaoData((prevState) => {
      return {
        ...prevState,
        ...getValues(),
        ...periodsFromForm(watchPeriodFields, daoData.periodDuration),
        ...depositsFromForm(watchDepositFields),
      };
    });

    if (step === 'summon') {
      alert('coming soon');
    } else {
      setCurrentStep(step);
    }
  };

  const handleCurrencyChange = (event) => {
    const selectedOption = currencyOptions(network.network_id).find(
      (option) => {
        return event.target.value === option.value;
      },
    );
    console.log('handle change', selectedOption);

    setDaoData((prevState) => {
      return {
        ...prevState,
        currency: selectedOption.value,
        approvedToken: selectedOption.address,
      };
    });
  };

  return (
    <Box className='SummonStepThree'>
      <form
        // className="Form NoCode"
        className='Form'
        onSubmit={handleSubmit(onSubmit)}
        autoComplete='off'
      >
        <Box>
          <Heading as='h4'>Name</Heading>
          <Text>
            <Input
              className='inline-field'
              name='name'
              ref={register({
                required: true,
              })}
            />
            {errors.name?.type === 'required' && (
              <span className='required-field'>DAOs need names</span>
            )}
          </Text>
        </Box>

        <Box>
          <Heading as='h4'>Description</Heading>
          <Text>
            <Textarea
              className='inline-field'
              name='description'
              ref={register({
                required: true,
              })}
            />
            {errors.description?.type === 'required' && (
              <span className='required-field'>daos need descriptions</span>
            )}
          </Text>
        </Box>

        <Box>
          <Heading as='h4'>Currency</Heading>
          <Text>
            Our primary currency is{' '}
            <select
              value={daoData.currency}
              onChange={handleCurrencyChange}
              className='inline-field'
            >
              {currencyOptions(network.network_id).map((option) => {
                return (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </Text>
          <Text>
            The minimum cost in {daoData.currency} to join will be{' '}
            <Input
              className='inline-field'
              name='minimumTribute'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />
            {errors.minimumTribute?.type === 'required' && (
              <span className='required-field Danger'>Required</span>
            )}
          </Text>
        </Box>

        <Box>
          <Heading as='h4'>Voting</Heading>
          <Text>
            Our voting period, in days, lasts{' '}
            <Input
              className='inline-field'
              name='formattedPeriods.votingPeriod'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />{' '}
            {errors.formattedPeriods?.votingPeriod?.type === 'required' && (
              <span className='required-field Danger'>Required</span>
            )}
            {errors.formattedPeriods?.votingPeriod?.type === 'pattern' && (
              <span className='required-field Danger'>Should be a number</span>
            )}
          </Text>
          <Text>
            Also in days, the grace period is another{' '}
            <Input
              className='inline-field'
              name='formattedPeriods.gracePeriod'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />{' '}
            {errors.formattedPeriods?.gracePeriod?.type === 'required' && (
              <span className='required-field Danger'>Required</span>
            )}
            {errors.formattedPeriods?.gracePeriod?.type === 'pattern' && (
              <span className='required-field Danger'>Should be a number</span>
            )}
          </Text>
        </Box>

        <Box>
          <Heading as='h4'>Deposits</Heading>
          <Text>
            A proposal deposit is in {daoData.currency} and costs{' '}
            <Input
              className='inline-field'
              name='formattedDeposits.proposalDeposit'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />
            {errors.formattedDeposits?.proposalDeposit?.type === 'required' && (
              <span className='required-field Danger'>Required</span>
            )}
            {errors.formattedDeposits?.proposalDeposit?.type === 'pattern' && (
              <span className='required-field'>Should be a number</span>
            )}{' '}
          </Text>
          <Text>
            The proposal reward is also in {daoData.currency} and is
            <Input
              className='inline-field'
              name='formattedDeposits.processingReward'
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
                validate: {
                  lessThanDeposit: (val) => {
                    return (
                      +val <= +getValues('formattedDeposits.proposalDeposit')
                    );
                  },
                },
              })}
            />
            {errors.formattedDeposits?.processingReward?.type ===
              'lessThanDeposit' && (
              <span className='required-field Danger'>
                Processing reward must be less than that proposal deposit
              </span>
            )}
            {errors.formattedDeposits?.processingReward?.type ===
              'required' && <span className='required-field'>required</span>}
            {errors.formattedDeposits?.processingReward?.type === 'pattern' && (
              <span className='required-field Danger'>Should be a number</span>
            )}
          </Text>
          <Text>
            Summoner Shares
            <Input
              className='inline-field'
              name='summonerShares'
              ref={register({
                required: true,
              })}
            />
          </Text>
        </Box>
        <Box className='StepControl'>
          <Button
            className='Outlined'
            onClick={() => navigate(2)}
            disabled={!isDirty && !isValid}
          >
            <RiArrowLeftFill /> GO BACK
          </Button>
          <Button
            type='submit'
            disabled={isSubmitted || (!isDirty && !isValid)}
            className={
              isSubmitted || (!isDirty && !isValid)
                ? 'disabled Button'
                : 'Button'
            }
          >
            Summon
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SummonStepThree;
