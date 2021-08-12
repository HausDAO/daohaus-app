import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BoostDetails from '../components/boostDetails';
import TheSummoner from '../components/theSummoner';
import FormBuilder from './formBuilder';

const StepperForm = ({ steps = {} }) => {
  const parentForm = useForm();
  const [currentStep, setCurrentStep] = useState(
    Object.values(steps).find(step => step.start),
  );
  const goToNext = stepKey => {
    setCurrentStep(steps[stepKey]);
  };

  if (currentStep?.type === 'form') {
    return (
      <FormBuilder
        {...currentStep.lego}
        parentForm={parentForm}
        goToNext={goToNext}
        next={currentStep.next}
      />
    );
  }
  if (currentStep?.type === 'details') {
    return (
      <BoostDetails
        content={currentStep.content}
        goToNext={goToNext}
        next={currentStep.next}
      />
    );
  }
  if (currentStep?.type === 'summoner') {
    return <TheSummoner />;
  }
  return null;
};

export default StepperForm;
