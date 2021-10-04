import React from 'react';
import FormBuilder from './formBuilder';

const BoostMetaForm = props => {
  const {
    currentStep,
    parentForm,
    goToNext,
    next,
    setStepperStorage,
    metaFields,
    secondaryBtn,
  } = props;
  const { getValues } = parentForm;

  const handleGoToNext = () => {
    const formValues = getValues();
    const metaUpdate = metaFields.reduce((update, fieldName) => {
      update[fieldName] = formValues[fieldName];
      return update;
    }, {});
    //  Does values still not persist through different steps?
    setStepperStorage(prevState => ({ ...prevState, ...metaUpdate }));
    goToNext(next);
  };

  return (
    <FormBuilder
      {...currentStep.form}
      parentForm={parentForm}
      goToNext={handleGoToNext}
      next={currentStep.next}
      ctaText={currentStep.ctaText || 'Next'}
      secondaryBtn={secondaryBtn}
    />
  );
};
export default BoostMetaForm;
