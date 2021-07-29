import React, { useState } from 'react';
import { Flex, FormControl } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useTX } from '../contexts/TXContext';
import { InputFactory } from './inputFactory';
import { FormFooter } from './staticElements';

import { checkFormTypes, validateRequired } from '../utils/validation';
import {
  collapse,
  inputDataFromABI,
  mapInRequired,
} from '../utils/formBuilder';

const FormBuilder = props => {
<<<<<<< HEAD
  const {
    submitTransaction,
    handleCustomValidation,
    modifyFields,
    submitCallback,
  } = useTX();
  const { fields, additionalOptions = null, required = [] } = props;
=======
  const { submitTransaction, handleCustomValidation, modifyFields } = useTX();
  const {
    fields,
    additionalOptions = null,
    required = [],
    localValues,
  } = props;
>>>>>>> 301e5c4f685e488568f7df87c3b7c69f0e9b7ef7

  const [loading, setLoading] = useState(false);
  const [formFields, setFields] = useState(mapInRequired(fields, required));

  const [options, setOptions] = useState(additionalOptions);
  const localForm = useForm();
  const { handleSubmit } = localForm;

  const addOption = e => {
    const selectedOption = options.find(
      option => option.htmlFor === e.target.value,
    );
    setOptions(options.filter(option => option.htmlFor !== e.target.value));
    setFields([...formFields, selectedOption]);
  };

  const buildABIOptions = abiString => {
    if (!abiString || typeof abiString !== 'string') return;
    const originalFields = mapInRequired(fields, required);
    if (abiString === 'clear' || abiString === 'hex') {
      setFields(originalFields);
    } else {
      const abiInputs = JSON.parse(abiString)?.inputs;
      setFields([...originalFields, ...inputDataFromABI(abiInputs)]);
    }
  };

  const updateErrors = errors => {
    setFields(prevFields =>
      prevFields.map(field => {
        const error = errors.find(error => error.name === field.name);
        if (error) {
          return { ...field, error };
        }
        return { ...field, error: false };
      }),
    );
  };
  const clearErrors = () => {
    setFields(prevFields =>
      prevFields.map(field => ({ ...field, error: false })),
    );
  };

  const onSubmit = async values => {
    clearErrors();

    //  Checks for required values
    const missingVals = validateRequired(
      values,
      formFields.filter(field => field.required),
    );
    if (missingVals) {
      updateErrors(missingVals);
      return;
    }

    //  Checks for type errors
    const typeErrors = checkFormTypes(values, formFields);
    if (typeErrors) {
      updateErrors(typeErrors);
      return;
    }
    const collapsedValues = collapse(values, '*MULTI*', 'objOfArrays');

    const modifiedValues = modifyFields({
      values: collapsedValues,
      activeFields: formFields,
      formData: props,
      tx: props.tx,
    });
    //  Checks for custom validation
    const customValErrors = handleCustomValidation({
      values: modifiedValues,
      formData: props,
    });
    if (customValErrors) {
      updateErrors(customValErrors);
      return;
    }
    //  checks if submit is not a contract interaction and is a callback
    if (props.onSubmit && !props.tx && typeof props.onSubmit === 'function') {
      try {
        return await submitCallback({
          values: modifiedValues,
          formData: props,
          onSubmit: props.onSubmit,
        });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    try {
      setLoading(true);
      await submitTransaction({
        values: modifiedValues,
        formData: props,
        localValues,
        tx: props.tx,
        lifeCycleFns: {
          onCatch() {
            setLoading(false);
          },
        },
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDir='column'>
        <FormControl display='flex' mb={5}>
          <Flex w='100%' flexWrap='wrap' justifyContent='space-between'>
            {formFields?.map(field => {
              return (
                <InputFactory
                  key={field?.htmlFor || field?.name}
                  {...field}
                  minionType={props.minionType}
                  layout={props.layout}
                  localForm={localForm}
                  localValues={localValues}
                  buildABIOptions={buildABIOptions}
                />
              );
            })}
          </Flex>
        </FormControl>
        <FormFooter options={options} addOption={addOption} loading={loading} />
      </Flex>
    </form>
  );
};

export default FormBuilder;
