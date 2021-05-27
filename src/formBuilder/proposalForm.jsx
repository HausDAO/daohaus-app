import React, { useState } from 'react';
import { Flex, FormControl } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useTX } from '../contexts/TXContext';
import { InputFactory } from './inputFactory';
import { FormFooter } from './staticElements';

import { checkFormTypes, validateRequired } from '../utils/validation';

const mapInRequired = (fields, required) => {
  return fields.map(field =>
    required.includes(field.name) ? { ...field, required: true } : field,
  );
};

const ProposalForm = props => {
  const { submitTransaction, handleCustomValidation } = useTX();
  const { fields, additionalOptions = null, required = [] } = props;

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
    const missingVals = validateRequired(
      values,
      formFields.filter(field => field.required),
    );
    if (missingVals) {
      updateErrors(missingVals);
      return;
    }
    const typeErrors = checkFormTypes(values, formFields);
    if (typeErrors) {
      updateErrors(typeErrors);
      return;
    }
    const customValErrors = handleCustomValidation({ values, formData: props });
    console.log('customValErrors :>> ', customValErrors);
    if (customValErrors) {
      updateErrors(customValErrors);
      return;
    }
    try {
      await submitTransaction({
        values,
        proposalLoading: setLoading,
        formData: props,
      });
    } catch (error) {
      console.error(error);
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
                  localForm={localForm}
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

export default ProposalForm;
