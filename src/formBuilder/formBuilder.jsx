import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Flex, FormControl } from '@chakra-ui/react';
import { BsCheckCircle } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';

import TextBox from '../components/TextBox';
import { useTX } from '../contexts/TXContext';
import { InputFactory } from './inputFactory';
import ProgressIndicator from '../components/progressIndicator';
import FormFooter from './formFooter';
import { checkFormTypes, validateRequired } from '../utils/validation';
import {
  checkConditionalTx,
  collapse,
  inputDataFromABI,
  mapInRequired,
} from '../utils/formBuilder';
import { omit } from '../utils/general';

const dev = process.env.REACT_APP_DEV;

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
    handleThen,
    ctaText,
    secondaryBtn,
    formConditions,
    logValues,
    onLoad,
    defaultValues,
    formSuccessMessage,
    formLoadingMessage,
    formErrorMessage,
  } = props;

  const [formState, setFormState] = useState(null);
  const [removeBlur, setRemoveBlur] = useState(null);
  const [formCondition, setFormCondition] = useState(formConditions?.[0]);
  const [formFields, setFields] = useState(mapInRequired(fields, required));
  const [formErrors, setFormErrors] = useState({});
  const [options, setOptions] = useState(additionalOptions);
  const localForm =
    parentForm || useForm({ shouldUnregister: false, defaultValues });
  const { handleSubmit, watch } = localForm;
  const values = watch();

  useEffect(() => logValues && dev && console.log(`values`, values), [values]);

  const addOption = e => {
    const selectedOption = options.find(
      option => option.htmlFor === e.target.value,
    );
    setOptions(options.filter(option => option.htmlFor !== e.target.value));

    const lastCol = formFields.slice(-1)?.[0];
    const rest = formFields.slice(0, -1);

    setFields([...rest, [...lastCol, selectedOption]]);
  };

  useEffect(() => {
    setFields(mapInRequired(fields, required));
  }, [fields]);

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

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
        // TODO: how to handle validation errors on fields within formCondition and checkGate input types
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
    // TODO: how to handle required values from inputs within formCondition & checkGate
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
      console.log('typeErrors', typeErrors);
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
      console.log('customValErrors', customValErrors);
      updateErrors(customValErrors);
      return;
    }

    const handleSubmitCallback = async () => {
      //  checks if submit is not a contract interaction and is a callback
      if (props.onSubmit && !props.tx && typeof props.onSubmit === 'function') {
        try {
          setFormState('loading');
          const res = await submitCallback({
            values: modifiedValues,
            formData: props,
            onSubmit: props.onSubmit,
          });
          // don't indicate on form
          setFormState('success');
          return res;
        } catch (error) {
          console.error(error);
          setFormState('error');
        }
      }
    };
    const handleSubmitTX = async then => {
      try {
        setFormState('loading');
        const res = await submitTransaction({
          values: modifiedValues,
          formData: props,
          localValues,
          tx: checkConditionalTx({ tx: props.tx, condition: formCondition }),
          lifeCycleFns: {
            ...props?.lifeCycleFns,
            onCatch() {
              setFormState('error');
              props?.lifeCycleFns?.onCatch?.();
            },
            afterTx() {
              if (typeof then === 'function') {
                then();
                setFormState('success');
              } else {
                setFormState('success');
              }
            },
          },
        });
        return res;
      } catch (error) {
        console.error(error);
        setFormState('error');
      }
    };

    //  HANDLE GO TO NEXT
    if (next && typeof goToNext === 'function') {
      if (typeof next === 'string') {
        return goToNext(next);
      }
      if (next?.type === 'awaitTx') {
        return handleSubmitTX(() => handleThen(next));
      }
    }
    let shouldRemove = true;
    if (props.removeBlurCallback) {
      try {
        setFormState('loading');
        shouldRemove = await props.removeBlurCallback();
        setRemoveBlur(shouldRemove);
        // don't indicate on form
        setFormState('success');
      } catch (error) {
        console.error(error);
        setFormState('error');
      }
    }
    //  HANDLE CALLBACK ON SUBMIT
    if (
      props.onSubmit &&
      !props.tx &&
      typeof props.onSubmit === 'function' &&
      shouldRemove
    ) {
      return handleSubmitCallback();
    }

    //  HANDLE CONTRACT TX ON SUBMIT
    if (props.tx && shouldRemove) {
      return handleSubmitTX();
    }
  };

  const useFormError = () => ({
    removeError(fieldName) {
      setFormErrors(prevState => omit(fieldName, prevState));
    },
    addError(fieldName, error) {
      setFormErrors(prevState => ({ ...prevState, [fieldName]: error }));
    },
  });

  const defaultIndicatorStates = {
    loading: {
      spinner: true,
      title: formLoadingMessage || 'Submitting...',
      explorerLink: true,
    },
    success: {
      icon: BsCheckCircle,
      title: formSuccessMessage || 'Form Submitted',
      explorerLink: true,
    },
    error: {
      icon: BiErrorCircle,
      title: formErrorMessage || 'Error Submitting Transaction',
      errorMessage: true,
    },
  };

  const renderInputs = (fields, depth = 0) => {
    return fields.map((field, index) => {
      let value = '';
      if (defaultValues) {
        value = defaultValues[field?.name];
      }

      return Array.isArray(field) ? (
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
          defaultValue={value || field?.defaultValue}
          key={`${depth}-${index}`}
          minionType={props.minionType}
          formCondition={formCondition}
          setFormCondition={setFormCondition}
          layout={props.layout}
          localForm={localForm}
          localValues={localValues}
          buildABIOptions={buildABIOptions}
          useFormError={useFormError}
          formState={formState}
        />
      );
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDir='column'>
        <FormControl display='flex'>
          {!removeBlur ? (
            <Flex
              display='flex'
              w='100%'
              h='100%'
              backdropFilter='blur(6px)'
              position='absolute'
              zIndex={5}
              justify='center'
              align='center'
            >
              <TextBox w='40%' textAlign='center'>
                Connect to update your profile
              </TextBox>
            </Flex>
          ) : (
            <></>
          )}

          <Flex
            width='100%'
            flexDirection={['column', null, 'row']}
            justifyContent='space-between'
          >
            {renderInputs(formFields)}
          </Flex>
        </FormControl>
        <ProgressIndicator
          currentState={formState}
          states={defaultIndicatorStates}
        />
        <FormFooter
          options={options}
          addOption={addOption}
          formState={formState}
          ctaText={ctaText}
          next={next}
          goToNext={goToNext}
          errors={Object.values(formErrors)}
          customSecondaryBtn={secondaryBtn}
          loading={formState === 'loading'}
        />
      </Flex>
    </form>
  );
};

export default FormBuilder;
