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

import { IsJsonString, isLastItem } from '../utils/general';
import {
  decrementTxIndex,
  getTxIndex,
  serializeTXs,
} from '../utils/formBuilder';

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

const MultiTXForm = props => {
  const { forms, logValues } = props;
  const parentForm = useForm();
  const { watch, register, setValue } = parentForm;
  const values = watch();
  const templateTXForm = forms[1];

  const [txForms, setTxForms] = useState(
    serializeTXs(forms.filter(form => form.isTx)),
  );

  useEffect(() => {
    if (logValues && dev && values) {
      console.log(`values`, values);
    }
  }, [values]);

  useEffect(() => {
    register('txIDs');
    setValue(
      'txIDs',
      txForms?.map(tx => tx.txID),
    );
    console.log(txForms);
  }, [txForms]);

  const preTxForm = forms[0];
  const confirmationForm = forms[forms.length - 1];

  const handleAddTx = () =>
    setTxForms(prevState => serializeTXs([...prevState, templateTXForm]));

  const handleRemoveTx = txIndex => {
    console.log(`txIndex`, txIndex);
    if (txIndex == null) return;
    const newForms = serializeTXs(
      txForms.filter(form => form.txIndex !== txIndex),
    );

    const newFormValues = {
      ...values,
      TX: values.TX.filter((tx, index) => index !== txIndex),
    };
    // const newFormValues = Object.entries(values).reduce((acc, [key, value]) => {
    //   // IF key value is the same txIndex
    //   if (key.includes(`TX.${txIndex}`)) {
    //     console.log('FIELD DELETED', key);
    //     // parentForm.unregister(key);
    //     return acc;
    //   }
    //   //  If key value is the same TX as txIndex, but a different number
    //   if (key.includes('TX')) {
    //     console.log('FIELD EXAMINED ', key);
    //     const currentIndex = Number(getTxIndex(key));
    //     return currentIndex > txIndex
    //       ? { ...acc, [decrementTxIndex(key)]: value }
    //       : { [key]: value };
    //   }
    //   console.log('FIELD SKIPPED', key);
    //   return { ...acc, [key]: value };
    // }, {});
    console.log('nweFormValues', newFormValues);
    // const unregisterList = Object.keys(values).filter(([key]) =>
    //   key.includes('*TX*'),
    // );
    // parentForm.unregister(unregisterList);
    parentForm.reset(newFormValues);
    setTxForms(newForms);
  };

  const setParentFields = (txID, fields) => {
    console.log('FIRING SET PARENT FIELDS FOR SOME REASON');
    console.log(`fields`, fields);
    setTxForms(prevState =>
      prevState.map(form => (form.txID === txID ? { ...form, fields } : form)),
    );
  };

  return (
    <MultiForm
      {...props}
      forms={[preTxForm, ...txForms, confirmationForm]}
      handleAddTx={handleAddTx}
      handleRemoveTx={handleRemoveTx}
      txForms={txForms}
      parentForm={parentForm}
      setParentFields={setParentFields}
    />
  );
};

const MultiForm = props => {
  const {
    forms,
    handleAddTx,
    handleRemoveTx,
    txForms,
    parentForm,
    tx,
    setParentFields,
  } = props;

  return forms?.map((form, index) => {
    if (form.isTx)
      return (
        <TxFormSection
          key={form.txID}
          form={tx ? { ...form, tx } : form}
          isLastItem={isLastItem(forms, index)}
          txIndex={form.txIndex}
          handleAddTx={handleAddTx}
          handleRemoveTx={handleRemoveTx}
          parentForm={parentForm}
          txForms={txForms}
          setParentFields={setParentFields}
        />
      );
    return (
      <FormSection
        key={form.id}
        form={tx ? { ...form, tx } : form}
        isLastItem={isLastItem(forms, index)}
        parentForm={parentForm}
        tx={tx}
        setParentFields={setParentFields}
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
    toggleVisible,
    setParentFields,
    isVisible = true,
  } = props;

  return (
    <Box>
      <Flex mb={3} justifyContent='flexStart'>
        <TextBox>{form?.title || title}</TextBox>
        {toggleVisible && (
          <Icon
            as={isVisible ? BiChevronDown : BiChevronUp}
            ml='auto'
            w='25px'
            h='25px'
            cursor='pointer'
            color='secondary.400'
            onClick={toggleVisible}
          />
        )}
      </Flex>

      <Box
        visibility={isVisible ? 'visible' : 'hidden'}
        height={isVisible ? 'fitContent' : '0'}
      >
        <FormBuilder
          {...form}
          footer={isLastItem}
          parentForm={parentForm}
          indicatorStates={isLastItem && indicatorStates}
          setParentFields={setParentFields}
        />
      </Box>
      {isVisible && <Flex justifyContent='flex-end'> {after} </Flex>}
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
  const abiSnippet = parentForm.watch(`TX.${txIndex}.abiInput`);
  const [isVisible, setIsVisible] = useState(true);
  const [fnName, setFnName] = useState('');

  useEffect(() => {
    if (abiSnippet && IsJsonString(abiSnippet)) {
      setFnName(JSON.parse(abiSnippet)?.name);
    } else {
      setFnName('');
    }
  }, [abiSnippet]);

  const toggleVisible = () => setIsVisible(prevState => !prevState);
  const handleClickAdd = () => {
    setIsVisible(false);
    handleAddTx(form);
  };
  const handleClickRemove = () => handleRemoveTx(txIndex);
  const isLastTx = txIndex === txForms?.length - 1;

  return (
    <FormSection
      title={`Transaction ${txIndex + 1} ${fnName && ` (${fnName})`}`}
      isLastItem={isLastItem}
      toggleVisible={toggleVisible}
      isVisible={isVisible}
      form={form}
      txIndex={txIndex}
      parentForm={parentForm}
      setParentFields={setParentFields}
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

export default MultiTXForm;
