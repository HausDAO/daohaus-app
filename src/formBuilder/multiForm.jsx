import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormSection from './formSection';
import TxFormSection from './txFormSection';

import { isLastItem } from '../utils/general';
import { serializeTXs } from '../utils/formBuilder';

const dev = process.env.REACT_APP_DEV;

const MultiTXForm = props => {
  const { forms, logValues, tx } = props;
  const parentForm = useForm();
  const { watch } = parentForm;
  const values = watch();

  const [txForms, setTxForms] = useState(
    serializeTXs(forms.filter(form => form.isTx)),
  );

  useEffect(() => {
    if (logValues && dev && values) {
      console.log(`values`, values);
    }
  }, [values]);

  const templateTXForm = forms[1];
  const preTxForm = forms[0];
  const confirmationForm = forms[forms.length - 1];
  const allForms = [preTxForm, ...txForms, confirmationForm];

  const handleAddTx = () =>
    setTxForms(prevState => serializeTXs([...prevState, templateTXForm]));

  const handleRemoveTx = txIndex => {
    if (txIndex == null) return;
    const newForms = serializeTXs(
      txForms.filter(form => form.txIndex !== txIndex),
    );
    const newFormValues = {
      ...values,
      TX: values.TX.filter((tx, index) => index !== txIndex),
    };
    parentForm.reset(newFormValues);
    setTxForms(newForms);
  };

  const setParentFields = (txID, fields) =>
    setTxForms(prevState =>
      prevState.map(form => (form.txID === txID ? { ...form, fields } : form)),
    );

  return allForms?.map((form, index) => {
    if (form.isTx)
      return (
        <TxFormSection
          key={form.txID}
          form={tx ? { ...form, tx } : form}
          isLastItem={isLastItem(allForms, index)}
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
        isLastItem={isLastItem(allForms, index)}
        parentForm={parentForm}
        tx={tx}
        setParentFields={setParentFields}
      />
    );
  });
};

export default MultiTXForm;
