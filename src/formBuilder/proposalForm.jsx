import React, { useState } from 'react';
import { Flex, FormControl } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useTX } from '../contexts/TXContext';
import { InputFactory } from './inputFactory';
import { FormFooter } from './staticElements';

import { checkFormTypes, validateRequired } from '../utils/validation';
import { FIELD } from '../staticElements/proposalFormData';
import { filterObject, isObjectEmpty } from '../utils/general';

const splitMulti = (key, value) => {
  const splitKey = key.split('*MULTI*');
  return { key: splitKey[0], value, order: splitKey[1] };
};
const collapseMultis = multis => {
  const newObj = {};
  for (const multi in multis) {
    const data = splitMulti(multi, multis[multi]);
    if (data.value) {
      if (newObj[data.key]) {
        newObj[data.key][data.order] = data.value;
      } else {
        newObj[data.key] = [data.value];
      }
    }
  }
  return newObj;
};

const convertMultiInputData = values => {
  const multis = filterObject(
    values,
    (value, key) => key.includes('*MULTI*') && value,
  );
  if (isObjectEmpty(multis)) return values;
  const noMultis = filterObject(
    values,
    (value, key) => !key.includes('*MULTI*') && value,
  );
  const organizedMultis = collapseMultis(multis);
  return { ...noMultis, ...organizedMultis };
};

const mapInRequired = (fields, required) => {
  return fields.map(field =>
    required.includes(field.name) ? { ...field, required: true } : field,
  );
};

export const inputDataFromABI = inputs => {
  const getType = type => {
    if (type === 'string' || type === 'address') {
      return type;
    }
    if (type.includes('int')) {
      return 'integer';
    }
    if (type === 'fixed' || type === 'ufixed') {
      return 'number';
    }
    return 'any';
  };

  const labels = {
    string: 'Enter text here',
    number: 'Numbers only',
    integer: 'Whole numbers only',
    address: '0x',
    urlNoHttp: 'www.example.fake',
  };

  return inputs.map((input, index) => {
    const localType = getType(input.type);
    const isMulti = input.type.includes('[]');
    return {
      type: isMulti ? 'multiInput' : 'input',
      label: input.name,
      name: `${index}*ARG*${input.name}`,
      htmlFor: `${index}*ARG*${input.name}`,
      placeholder: labels[localType] || input.type,
      expectType: isMulti ? 'any' : getType(localType),
      required: false,
    };
  });
};

const ProposalForm = props => {
  const { submitTransaction, handleCustomValidation } = useTX();
  const { fields, additionalOptions = null, required = [] } = props;

  const [loading, setLoading] = useState(false);
  const [formFields, setFields] = useState(mapInRequired(fields, required));

  const [options, setOptions] = useState(additionalOptions);
  const localForm = useForm();
  const { handleSubmit } = localForm;

  const watching = localForm.watch();
  console.log(watching);

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
    const appendingFields = [
      FIELD.MINION_PAYMENT,
      { ...FIELD.DESCRIPTION, h: '10' },
    ];
    if (abiString === 'clear') {
      setFields(originalFields);
    } else if (abiString === 'hex') {
      setFields([...originalFields, ...appendingFields]);
    } else {
      const abiInputs = JSON.parse(abiString)?.inputs;
      setFields([
        ...originalFields,
        ...inputDataFromABI(abiInputs),
        ...appendingFields,
      ]);
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
      console.log(`formFields`, formFields);
      console.log('isUpdating errors');
      updateErrors(typeErrors);
      return;
    }
    const customValErrors = handleCustomValidation({ values, formData: props });
    const collapsedValues = convertMultiInputData(values);
    console.log(`collapsedValues`, collapsedValues);

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

export default ProposalForm;
