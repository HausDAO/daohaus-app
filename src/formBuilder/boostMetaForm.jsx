import React from 'react';
import FormBuilder from './formBuilder';

const BoostMetaForm = props => {
  const {
    currentStep,
    parentForm,
    goToNext,
    setStepperStorage,
    metaFields,
  } = props;
  const { getValues } = parentForm;

  const handleGoToNext = () => {
    const formValues = getValues();
    const metaUpdate = metaFields.reduce((update, fieldName) => {
      update[fieldName] = formValues[fieldName];
      return update;
    }, {});
    setStepperStorage(prevState => ({ ...prevState, ...metaUpdate }));
    goToNext();
  };

  return (
    <FormBuilder
      {...currentStep.lego}
      parentForm={parentForm}
      goToNext={handleGoToNext}
      next={currentStep.next}
      ctaText={currentStep.ctaText || 'Next'}
    />
  );
};
export default BoostMetaForm;
