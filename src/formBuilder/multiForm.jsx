import React, { useState } from 'react';
import { Box, Button, Divider, Flex, Icon } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

import { BiChevronDown, BiChevronUp, BiMinus, BiPlus } from 'react-icons/bi';
import FormBuilder from './formBuilder';
import TextBox from '../components/TextBox';

import { isLastItem } from '../utils/general';
import { serializeFields } from '../utils/formBuilder';

const serializeTXs = (forms = []) =>
  forms.map((form, index) => ({
    ...form,
    txIndex: index,
    txID: form.txID || uuid(),
  }));

const MultiForm = props => {
  const { forms, isTxBuilder } = props;
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
    console.log(`txIndex`, txIndex);
    if (txIndex == null) return;
    const newForms = serializeTXs(
      txForms.filter(form => form.txIndex !== txIndex),
    );
    console.log(`newForms`, newForms);
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
      />
    );
  }
  return <StaticMultiForm {...props} />;
};

const StaticMultiForm = props => {
  const {
    forms,
    handleAddTx,
    handleRemoveTx,
    txForms,
    setParentFields,
  } = props;
  const parentForm = useForm();

  return forms?.map((form, index) => {
    if (form.isTx)
      return (
        <TxFormSection
          key={`${form.id}-${form.txID}`}
          form={form}
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
        form={form}
        isLastItem={isLastItem(forms, index)}
        parentForm={parentForm}
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
