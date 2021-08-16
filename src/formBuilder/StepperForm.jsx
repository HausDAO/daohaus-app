import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BoostDetails from '../components/boostDetails';
import TheSummoner from '../components/theSummoner';
import { useFormModal } from '../contexts/OverlayContext';
import FormBuilder from './formBuilder';

const StepperForm = ({ steps = {} }) => {
  const parentForm = useForm({ shouldUnregister: false });
  const { closeModal } = useFormModal();

  const [currentStep, setCurrentStep] = useState(
    Object.values(steps).find(step => step.start),
  );
  const goToNext = stepKey => {
    if (stepKey === 'DONE') {
      closeModal();
    } else {
      setCurrentStep(steps[stepKey]);
    }
  };

  if (currentStep?.type === 'form') {
    return (
      <FormBuilder
        {...currentStep.lego}
        parentForm={parentForm}
        goToNext={goToNext}
        next={currentStep.next}
        ctaText={currentStep.ctaText || 'Next'}
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
    return (
      <TheSummoner
        {...currentStep}
        localForm={parentForm}
        next={currentStep.next}
        goToNext={goToNext}
      />
    );
  }
  return null;
};

export default StepperForm;
