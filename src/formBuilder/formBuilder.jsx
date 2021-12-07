import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Flex, FormControl } from '@chakra-ui/react';

import { useTX } from '../contexts/TXContext';
import { InputFactory } from './inputFactory';
import ProgressIndicator from '../components/progressIndicator';
import FormFooter from './formFooter';
import {
  checkConditionalTx,
  createRegisterOptions,
  inputDataFromABI,
} from '../utils/formBuilder';
import { useAppModal } from '../hooks/useModals';
import { useMetaData } from '../contexts/MetaDataContext';
import useBoost from '../hooks/useBoost';
import { validate } from '../utils/validation';

const dev = process.env.REACT_APP_DEV;

const FormBuilder = props => {
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
    footer = true,
    secondaryBtn,
    formConditions,
    setParentFields,
    indicatorStates,
    txID,
    logValues,
    tx,
    checklist = ['isConnected', 'isSameChain'],
  } = props;
  const { submitTransaction, handleCustomValidation, submitCallback } = useTX();
  const { daoMetaData } = useMetaData();
  const { spamFilterNotice } = useBoost();

  const { closeModal } = useAppModal();
  const [formState, setFormState] = useState('idle');
  const [indicatorStatesOverride, setIndicatorStatesOverride] = useState(null);

  const [formCondition, setFormCondition] = useState(formConditions?.[0]);
  const [formFields, setFields] = useState(null);
  const [formErrors, setFormErrors] = useState([]);

  const [options, setOptions] = useState(additionalOptions);
  const localForm = parentForm || useForm({ shouldUnregister: false });
  const { handleSubmit, watch, errors } = localForm;
  const values = watch();

  useEffect(() => {
    if (dev && values && logValues) {
      console.log(`values`, values);
    }
  }, [values, errors]);

  useEffect(() => setFields(fields), [fields]);

  useEffect(() => {
    setIndicatorStatesOverride(spamFilterNotice(tx));
  }, [daoMetaData, tx]);

  const addOption = e => {
    const selectedOption = options.find(
      option => option.htmlFor === e.target.value,
    );
    setOptions(options.filter(option => option.htmlFor !== e.target.value));

    const lastCol = formFields.slice(-1)?.[0];
    const rest = formFields.slice(0, -1);

    setFields([...rest, [...lastCol, selectedOption]]);
  };

  const buildABIOptions = (abiString, serialTag = false) => {
    if (!abiString || typeof abiString !== 'string' || validate.hex(abiString))
      return;

    if (abiString === 'clear' || abiString === 'hex') {
      if (setParentFields) {
        setParentFields(txID, fields);
      } else {
        setFields(fields);
      }
    } else {
      if (!validate.jsonString(abiString)) return;

      const abiInputs = JSON.parse(abiString)?.inputs;

      if (setParentFields) {
        setParentFields(txID, [
          fields[0],
          inputDataFromABI(abiInputs, serialTag),
        ]);
      } else {
        const updatedFields = [
          ...fields[fields.length - 1],
          ...inputDataFromABI(abiInputs, serialTag),
        ];
        const payload =
          fields.length > 1 ? [fields[0], updatedFields] : [updatedFields];
        setFields(payload);
      }
    }
  };

  const onSubmit = async values => {
    const customValErrors = handleCustomValidation({
      values,
      formData: props,
    });

    if (customValErrors) {
      setFormErrors(customValErrors);
      return;
    }

    const handleSubmitCallback = async () => {
      //  checks if submit is not a contract interaction and is a callback
      if (props.onSubmit && !props.tx && typeof props.onSubmit === 'function') {
        try {
          setFormState('loading');
          const res = await submitCallback({
            values,
            formData: props,
            onSubmit: props.onSubmit,
          });
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
          values,
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

    //  HANDLE CALLBACK ON SUBMIT
    if (props.onSubmit && !props.tx && typeof props.onSubmit === 'function')
      return handleSubmitCallback();

    //  HANDLE CONTRACT TX ON SUBMIT
    return handleSubmitTX();
  };

  const renderInputs = (fields, depth = 0) => {
    return fields?.map((field, index) =>
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
          registerOptions={createRegisterOptions(field, required)}
          required={required}
          errors={errors}
          minionType={props.minionType}
          formCondition={formCondition}
          setFormCondition={setFormCondition}
          layout={props.layout}
          localForm={localForm}
          localValues={localValues}
          buildABIOptions={buildABIOptions}
          formState={formState}
        />
      ),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDir='column'>
        <FormControl display='flex'>
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
          states={indicatorStatesOverride || indicatorStates}
        />
        {footer && (
          <FormFooter
            options={options}
            addOption={addOption}
            formState={formState}
            ctaText={ctaText}
            closeModal={closeModal}
            next={next}
            goToNext={goToNext}
            errors={Object.values(formErrors)}
            customSecondaryBtn={secondaryBtn}
            loading={formState === 'loading'}
            checklist={checklist}
          />
        )}
      </Flex>
    </form>
  );
};

export default FormBuilder;
