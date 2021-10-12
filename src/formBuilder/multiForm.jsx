import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Flex, Icon } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

import {
  BiChevronDown,
  BiChevronUp,
  BiErrorCircle,
  BiMinus,
  BiPlus,
} from 'react-icons/bi';
import { BsCheckCircle } from 'react-icons/bs';
import { RiErrorWarningLine } from 'react-icons/ri';
import FormBuilder from './formBuilder';
import TextBox from '../components/TextBox';

import { isLastItem } from '../utils/general';
import { getTagRegex, serializeFields } from '../utils/formBuilder';

const dev = process.env.REACT_APP_DEV;

const indicatorStates = {
  loading: {
    spinner: true,
    title: 'Submitting...',
    explorerLink: true,
  },
  success: {
    icon: BsCheckCircle,
    title: 'Form Submitted',
    explorerLink: true,
  },
  error: {
    icon: BiErrorCircle,
    title: 'Error Submitting Transaction',
    errorMessage: true,
  },
  idle: {
    icon: RiErrorWarningLine,
    titleSm:
      'Early execution will not be available for this proposal. Forwarded funds must be within available minion funds. ',
  },
};

const serializeTXs = (forms = []) =>
  forms.map((form, index) => ({
    ...form,
    txIndex: index,
    txID: form.txID || uuid(),
  }));

const MultiForm = props => {
  const { forms, isTxBuilder, logValues } = props;
  const parentForm = useForm({ shouldUnregister: true });
  const values = parentForm?.watch();

  useEffect(() => {
    if (logValues && dev && values) {
      console.log(`values`, values);
    }
  }, [values]);

  const preTxForm = forms[0];
  const confirmationForm = forms[forms.length - 1];

  const [txForms, setTxForms] = useState(
    serializeTXs(forms.filter(form => form.isTx)),
  );

  const handleAddTx = form =>
    setTxForms(prevState =>
      serializeTXs([...prevState, { ...form, txID: uuid() }]),
    );

  const handleRemoveTx = txIndex => {
    if (txIndex == null) return;
    const newForms = serializeTXs(
      txForms.filter(form => form.txIndex !== txIndex),
    );

    const newFormValues = Object.entries(values).reduce((acc, [key, value]) => {
      // IF key value is the same txIndex
      if (key.includes(`*TX${txIndex}`)) {
        return acc;
      }
      //  If key value is the same TX as txIndex, but a different number
      if (key.includes('*TX')) {
        parentForm.unregister(key);
        const checkSerial = key => {
          // possibly replace the tag with another decremented tag
          return key.replace(getTagRegex('TX'), tag => {
            //  pull number from the tag
            return tag.replace(/\d+/, tagNumString => {
              const tagIndex = Number(tagNumString);
              //  If the value is higher than txIndex,
              //  reduce it by one
              return tagIndex > txIndex ? tagIndex - 1 : tagIndex;
            });
          });
        };
        return { ...acc, [checkSerial(key)]: value };
      }
      return { ...acc, [key]: value };
    }, {});
    parentForm.reset(newFormValues);
    setTxForms(newForms);
  };

  const setParentFields = (txIndex, newFields) => {
    setTxForms(prevState =>
      prevState.map(form =>
        form.txIndex === txIndex ? { ...form, fields: newFields } : form,
      ),
    );
  };
  if (isTxBuilder) {
    return (
      <StaticMultiForm
        {...props}
        forms={[preTxForm, ...txForms, confirmationForm]}
        handleAddTx={handleAddTx}
        handleRemoveTx={handleRemoveTx}
        txForms={txForms}
        setParentFields={setParentFields}
        parentForm={parentForm}
      />
    );
  }
  return <StaticMultiForm {...props} parentForm={parentForm} />;
};

const StaticMultiForm = props => {
  const {
    forms,
    handleAddTx,
    handleRemoveTx,
    txForms,
    setParentFields,
    parentForm,
    tx,
  } = props;

  return forms?.map((form, index) => {
    if (form.isTx)
      return (
        <TxFormSection
          key={`${form.id}-${form.txID}`}
          form={tx ? { ...form, tx } : form}
          isLastItem={isLastItem(forms, index)}
          txIndex={form.txIndex}
          handleAddTx={handleAddTx}
          handleRemoveTx={handleRemoveTx}
          parentForm={parentForm}
          setParentFields={setParentFields}
          txForms={txForms}
        />
      );
    return (
      <FormSection
        key={`${form.id}-${index}`}
        form={tx ? { ...form, tx } : form}
        isLastItem={isLastItem(forms, index)}
        parentForm={parentForm}
        tx={tx}
      />
    );
  });
};

const FormSection = props => {
  const {
    title,
    after,
    parentForm,
    isLastItem,
    form,
    serializedFields,
    setParentFields,
    parentFields,
  } = props;

  const [isOpen, setIsOpen] = useState(true);
  const toggleMenu = () => setIsOpen(prevState => !prevState);

  return (
    <Box>
      <Flex mb={3} justifyContent='space-between'>
        <TextBox>{form?.title || title}</TextBox>
        <Icon
          as={isOpen ? BiChevronDown : BiChevronUp}
          w='25px'
          h='25px'
          cursor='pointer'
          color='secondary.400'
          onClick={toggleMenu}
        />
      </Flex>
      {isOpen && (
        <FormBuilder
          {...form}
          footer={isLastItem}
          parentForm={parentForm}
          fields={serializedFields || form?.fields}
          setParentFields={setParentFields}
          parentFields={parentFields}
          indicatorStates={isLastItem && indicatorStates}
        />
      )}
      {isOpen && <> {after} </>}
      <Divider my={4} />
    </Box>
  );
};

const TxFormSection = props => {
  const {
    handleAddTx,
    handleRemoveTx,
    txIndex,
    txForms,
    form,
    isLastItem,
    parentForm,
    setParentFields,
  } = props;

  const handleClickAdd = () => handleAddTx(form);
  const handleClickRemove = () => handleRemoveTx(txIndex);
  const handleSetParentFields = newFields =>
    setParentFields(txIndex, newFields);
  const isLastTx = txIndex === txForms?.length - 1;

  return (
    <FormSection
      key={form.txID}
      title={`Transaction ${txIndex + 1}`}
      isLastItem={isLastItem}
      form={form}
      parentForm={parentForm}
      serializedFields={serializeFields(form.fields, form.txIndex, 'TX')}
      setParentFields={handleSetParentFields}
      after={
        <Flex justifyContent='flex-end'>
          {isLastTx ? (
            <Button variant='ghost' onClick={handleClickAdd}>
              <TextBox>Add TX</TextBox>
              <Icon ml={2} as={BiPlus} w='20px' h='20px' cursor='pointer' />
            </Button>
          ) : (
            <Button variant='ghost' onClick={handleClickRemove}>
              <TextBox>Remove TX</TextBox>
              <Icon ml={2} as={BiMinus} w='20px' h='20px' cursor='pointer' />
            </Button>
          )}
        </Flex>
      }
    />
  );
};

export default MultiForm;
