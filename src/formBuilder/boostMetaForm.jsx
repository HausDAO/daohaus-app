import React from 'react';
import FormBuilder from './formBuilder';

const BoostMetaForm = props => {
  const { currentStep, parentForm, goToNext, setStepperStorage } = props;
  const { getValues } = parentForm;

  const handleGoToNext = () => {
    const formValues = getValues();
    setStepperStorage(formValues);
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
