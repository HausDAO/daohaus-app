import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormBuilder from './formBuilder';

const StepperForm = ({ steps = [] }) => {
  const parentForm = useForm();
  const [currentStep, setCurrentStep] = useState(
    steps.find(step => step.start),
  );
  const goToNext = stepID => {};
  if (currentStep?.ui?.type === 'form') {
    <FormBuilder
      {...currentStep.ui.lego}
      parentForm={parentForm}
      goToNext={goToNext}
    />;
  }
};

export default StepperForm;
