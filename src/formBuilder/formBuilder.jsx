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
  const { submitTransaction, handleCustomValidation, modifyFields } = useTX();
  const {
    fields,
    additionalOptions = null,
    required = [],
    localValues,
  } = props;

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
    // REVIEW
    setFields(prevFields => {
      const update = field => {
        if (Array.isArray(field)) {
          return field.map(update);
        }
        const error = errors.find(error => error.name === field.name);
        return { ...field, error };
      };
      return prevFields.map(update);
    });
  };
  const clearErrors = () => {
    // REVIEW
    setFields(prevFields => {
      const clear = f =>
        Array.isArray(f) ? f.map(clear) : { ...f, error: false };
      return prevFields.map(clear);
    });
  };

  const onSubmit = async values => {
    clearErrors();

    //  Checks for required values
    const missingVals = validateRequired(
      values,
      // REVIEW
      // formFields.filter(field => field.required),
      formFields.flat(Infinity).filter(field => field.required),
    );

    if (missingVals) {
      console.log('missingVals', missingVals);
      updateErrors(missingVals);
      return;
    }

    //  Checks for type errors
    // REVIEW
    // const typeErrors = checkFormTypes(values, formFields);
    const typeErrors = checkFormTypes(values, formFields.flat(Infinity));
    if (typeErrors) {
      updateErrors(typeErrors);
      return;
    }
    const collapsedValues = collapse(values, '*MULTI*', 'objOfArrays');

    const modifiedValues = modifyFields({
      values: collapsedValues,
      // REVIEW
      // activeFields: formFields,
      activeFields: formFields.flat(Infinity),
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
          ...props.lifeCycleFns,
        },
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderInputs = fields =>
    fields.map(field =>
      Array.isArray(field) ? (
        <Flex flex={1} flexDir='column'>
          {renderInputs(field)}
        </Flex>
      ) : (
        <InputFactory
          key={field?.htmlFor || field?.name}
          {...field}
          minionType={props.minionType}
          layout={props.layout}
          localForm={localForm}
          localValues={localValues}
          buildABIOptions={buildABIOptions}
        />
      ),
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDir='column'>
        <FormControl display='flex' mb={5}>
          <Flex
            width='100%'
            flexDirection={['column', null, 'row']}
            justifyContent='space-between'
          >
            {renderInputs(formFields)}
          </Flex>
        </FormControl>
        <FormFooter options={options} addOption={addOption} loading={loading} />
      </Flex>
    </form>
  );
};

export default FormBuilder;
