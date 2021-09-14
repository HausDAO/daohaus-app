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
import { omit } from '../utils/general';

const FormBuilder = props => {
  const {
    submitTransaction,
    handleCustomValidation,
    modifyFields,
    submitCallback,
  } = useTX();
  const {
    fields,
    additionalOptions = null,
    required = [],
    localValues,
    parentForm,
    next,
    goToNext,
    ctaText,
    secondaryBtn,
  } = props;

  const [loading, setLoading] = useState(false);
  const [formFields, setFields] = useState(mapInRequired(fields, required));
  const [formErrors, setFormErrors] = useState({});
  const [options, setOptions] = useState(additionalOptions);
  const localForm = parentForm || useForm({ shouldUnregister: false });
  const { handleSubmit } = localForm;

  const addOption = e => {
    const selectedOption = options.find(
      option => option.htmlFor === e.target.value,
    );
    setOptions(options.filter(option => option.htmlFor !== e.target.value));

    const lastCol = formFields.slice(-1)?.[0];
    const rest = formFields.slice(0, -1);

    setFields([...rest, [...lastCol, selectedOption]]);
  };

  const buildABIOptions = abiString => {
    if (!abiString || typeof abiString !== 'string') return;
    const originalFields = mapInRequired(fields, required);

    if (abiString === 'clear' || abiString === 'hex') {
      setFields(originalFields);
    } else {
      const abiInputs = JSON.parse(abiString)?.inputs;
      let updatedFields = [
        ...originalFields[originalFields.length - 1],
        ...inputDataFromABI(abiInputs),
      ];
      if (originalFields.length > 1) {
        updatedFields = [originalFields[0], updatedFields];
      }
      setFields(updatedFields);
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
    console.log(`collapsedValues`, collapsedValues);
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

    const handleSubmitCallback = async () => {
      //  checks if submit is not a contract interaction and is a callback
      if (props.onSubmit && !props.tx && typeof props.onSubmit === 'function') {
        try {
          setLoading(true);
          const res = await submitCallback({
            values: modifiedValues,
            formData: props,
            onSubmit: props.onSubmit,
          });
          return res;
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }
    };
    const handleSubmitTX = async () => {
      try {
        setLoading(true);
        const res = await submitTransaction({
          values: modifiedValues,
          formData: props,
          localValues,
          tx: props.tx,
          lifeCycleFns: {
            ...props?.lifeCycleFns,
            onCatch() {
              setLoading(false);
              props?.lifeCycleFns?.onCatch?.();
            },
            afterTx() {
              props?.lifeCycleFns?.afterTx?.();
            },
          },
        });
        setLoading(false);
        return res;
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    // const handleConditional = async choice => {
    //   if (choice.tx && choice.then)
    //     return () => handleSubmitTX(handleConditional(choice.then));
    //   if (choice.tx) return () => handleSubmitTX();
    //   if (choice.callback) return () => handleSubmitCallback();
    //   if (choice.goTo) return () => goToNext(choice.goTo);
    // };

    if (next && typeof goToNext === 'function') {
      return goToNext(next);

      // const choice = next[condition];
      // return handleConditional(choice)();
    }
    //  HANDLE CALLBACK ON SUBMIT
    if (props.onSubmit && !props.tx && typeof props.onSubmit === 'function') {
      return handleSubmitCallback();
    }
    //  HANDLE CONTRACT TX ON SUBMIT
    return handleSubmitTX();
  };

  const useFormError = () => ({
    removeError(fieldName) {
      setFormErrors(prevState => omit(fieldName, prevState));
    },
    addError(fieldName, error) {
      setFormErrors(prevState => ({ ...prevState, [fieldName]: error }));
    },
  });

  const renderInputs = (fields, depth = 0) => {
    return fields.map((field, index) =>
      Array.isArray(field) ? (
        <Flex
          flex={1}
          flexDir='column'
          key={`${depth}-${index}`}
          _notFirst={{ pl: [0, null, 8] }}
        >
          {renderInputs(field, depth + 1)}
        </Flex>
      ) : (
        <InputFactory
          {...field}
          key={`${depth}-${index}`}
          minionType={props.minionType}
          layout={props.layout}
          localForm={localForm}
          localValues={localValues}
          buildABIOptions={buildABIOptions}
          useFormError={useFormError}
        />
      ),
    );
  };

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
        <FormFooter
          options={options}
          addOption={addOption}
          loading={loading}
          ctaText={ctaText}
          next={next}
          goToNext={goToNext}
          errors={Object.values(formErrors)}
          secondaryBtn={secondaryBtn}
        />
      </Flex>
    </form>
  );
};

export default FormBuilder;
