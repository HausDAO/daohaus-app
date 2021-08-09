import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BoostDetails from '../components/boostDetails';
import { FORM } from '../data/forms';
import FormBuilder from './formBuilder';

const StepperForm = ({ steps = {} }) => {
  const parentForm = useForm();
  const [currentStep, setCurrentStep] = useState(
    Object.values(steps).find(step => step.start),
  );
  const goToNext = () => {
    console.log('fired');
    setCurrentStep(steps[currentStep.next]);
  };

  if (currentStep?.type === 'form') {
    return (
      <FormBuilder
        {...currentStep.lego}
        parentForm={parentForm}
        goToNext={goToNext}
      />
    );
  }
  if (currentStep?.type === 'details') {
    return <BoostDetails content={currentStep.content} goToNext={goToNext} />;
  }
  return null;
};

export default StepperForm;
