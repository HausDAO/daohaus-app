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
    checklist,
    handleThen,
  } = props;
  const { getValues } = parentForm;

  const handleGoToNext = () => {
    const formValues = getValues();

    if (metaFields) {
      const metaUpdate = metaFields.reduce((update, fieldName) => {
        update[fieldName] = formValues[fieldName];
        return update;
      }, {});
      setStepperStorage(prevState => ({ ...prevState, ...metaUpdate }));
    } else {
      setStepperStorage(prevState => ({ ...prevState }));
    }

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
      checklist={checklist}
      handleThen={handleThen}
    />
  );
};
export default BoostMetaForm;
