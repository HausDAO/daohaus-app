import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useOverlay } from '../contexts/OverlayContext';
import { useAppModal } from '../hooks/useModals';
import BoostDetails from '../components/boostDetails';
import BoostMetaForm from './boostMetaForm';
import DiscordNotificationsLaunch from './discordLaunchForm';
import FormBuilder from './formBuilder';
import ZodiacActionForm from './zodiacActionForm';
import Signer from '../components/signer';
import TheSummoner from '../components/theSummoner';
import ButtonAction from '../components/buttonAction';

const getStepTitle = (currentStep, props) => {
  if (typeof currentStep?.title === 'string') return currentStep.title;
  if (currentStep?.form) return currentStep?.form?.title;
  if (currentStep?.title?.type === 'minionName') {
    return props.minionData?.content?.title;
  }
  if (currentStep?.title?.type === 'boostName')
    return props.boostContent?.title;
  return null;
};

const StepperForm = props => {
  const {
    steps = {},
    minionData,
    boostContent,
    playlist,
    metaFields,
    updateModalUI,
  } = props;

  const parentForm = useForm({ shouldUnregister: false });
  const { closeModal } = useAppModal();
  const { errorToast } = useOverlay();
  const [formSteps, setFormSteps] = useState(steps);
  const [currentStep, setCurrentStep] = useState(
    Object.values(formSteps).find(step => step.start),
  );
  const [stepperStorage, setStepperStorage] = useState();

  const userSteps = useMemo(() => {
    if (formSteps) {
      return Object.values(formSteps)
        .filter(step => step.isUserStep)
        .map((step, index) => ({ ...step, position: index + 1 }));
    }
    return [];
  }, [formSteps]);

  useEffect(() => {
    if (!currentStep || !userSteps || typeof updateModalUI !== 'function')
      return;
    if (currentStep.isUserStep) {
      const position = userSteps.find(
        step => step.stepLabel === currentStep.stepLabel,
      )?.position;
      updateModalUI({
        title: getStepTitle(currentStep, props),
        subtitle:
          currentStep?.subtitle ||
          `Step ${position} of ${userSteps?.length}: ${currentStep.stepLabel}`,
      });
    } else {
      updateModalUI({
        title: getStepTitle(currentStep, props),
        subtitle: currentStep?.subtitle,
      });
    }
  }, [currentStep, userSteps]);

  const goToNext = next => {
    const handleNextStep = nextString => {
      const nextStep = formSteps[nextString];
      if (nextStep) {
        setCurrentStep(nextStep);
      } else {
        errorToast({
          title: 'Next step does not match any other steps',
          description:
            'Check the steps and make sure the "next" key links to a valid step',
        });
      }
    };
    if (currentStep.finish) {
      closeModal();
    } else if (
      typeof next === 'string' ||
      typeof currentStep.next === 'string'
    ) {
      handleNextStep(next);
    } else if (currentStep.next) {
      handleNextStep(currentStep.next);
    } else {
      errorToast({
        title: "Incorrect 'Next' Value",
        description:
          'Next step is an unrecognized specialType, undefined, or falsy. Check console.',
      });
    }
  };

  const handleThen = nextObj => {
    if (!nextObj?.then)
      throw new Error(
        'StepperForm.jsx => handleThen(): Did not recieve a valid .then property',
      );

    const getNewCtaText = next => {
      if (next?.then === 'FINISH') {
        return 'Finish';
      }
      if (next?.then?.ctaText) return nextObj.then.ctaText;
      return 'Next >';
    };

    setCurrentStep(prevState => ({
      ...prevState,
      next: nextObj.then,
      ctaText: getNewCtaText(nextObj),
    }));
  };

  const updateFormSteps = addSteps => {
    const prevLastStep = Object.keys(formSteps).reverse()[0];
    const overrideNext =
      typeof formSteps[prevLastStep].next === 'string'
        ? Object.keys(addSteps)[0]
        : {
            ...formSteps[prevLastStep].next,
            then: Object.keys(addSteps)[0],
          };
    setCurrentStep(prevState => {
      return {
        ...prevState,
        finish: false,
        next: overrideNext,
      };
    });
    setFormSteps(prevState => {
      const updatedSteps = {
        ...prevState,
        ...addSteps,
      };
      updatedSteps[prevLastStep] = {
        ...updatedSteps[prevLastStep],
        finish: false,
        next: overrideNext,
      };
      return updatedSteps;
    });
  };

  const secondaryBtn = {
    text: 'Cancel',
    fn: () => closeModal(),
  };

  if (currentStep?.type === 'form') {
    return (
      <FormBuilder
        {...currentStep.form}
        key={currentStep.form.id}
        parentForm={parentForm}
        goToNext={goToNext}
        next={currentStep.next}
        defaultValues={stepperStorage}
        ctaText={
          currentStep?.finish
            ? 'Submit'
            : currentStep?.next?.ctaText || 'Next >'
        }
        handleThen={handleThen}
        boostId={props.id}
      />
    );
  }
  if (currentStep?.type === 'boostMetaForm') {
    return (
      <BoostMetaForm
        currentStep={currentStep}
        parentForm={parentForm}
        metaFields={metaFields}
        goToNext={goToNext}
        next={currentStep.next}
        setStepperStorage={setStepperStorage}
        secondaryBtn={secondaryBtn}
        checklist={currentStep.checklist}
        handleThen={handleThen}
      />
    );
  }
  if (currentStep?.type === 'boostDetails') {
    return (
      <BoostDetails
        {...props}
        goToNext={goToNext}
        next={currentStep.next}
        userSteps={userSteps}
        steps={steps}
        secondaryBtn={secondaryBtn}
      />
    );
  }
  if (currentStep?.type === 'summoner') {
    return (
      <TheSummoner
        // Todo clean current step stuff
        {...currentStep}
        parentForm={parentForm}
        currentStep={currentStep}
        next={currentStep.next}
        minionData={minionData}
        goToNext={goToNext}
        boostContent={boostContent}
        secondaryBtn={secondaryBtn}
        handleThen={handleThen}
        updateFormSteps={updateFormSteps}
      />
    );
  }
  if (currentStep?.type === 'signer') {
    return (
      <Signer
        {...currentStep}
        boostData={props}
        stepperStorage={stepperStorage}
        parentForm={parentForm}
        next={currentStep.next}
        goToNext={goToNext}
        playlist={playlist}
        secondaryBtn={secondaryBtn}
      />
    );
  }
  if (currentStep?.type === 'discordForm') {
    return (
      <DiscordNotificationsLaunch
        currentStep={currentStep}
        metaFields={metaFields}
        next={currentStep.next}
        goToNext={goToNext}
        setStepperStorage={setStepperStorage}
        secondaryBtn={secondaryBtn}
      />
    );
  }
  if (currentStep?.type === 'zodiacActionForm') {
    return (
      <ZodiacActionForm
        boostId={props.id}
        currentStep={currentStep}
        goToNext={goToNext}
        metaFields={metaFields}
        next={currentStep.next}
        parentForm={parentForm}
        secondaryBtn={secondaryBtn}
        setStepperStorage={setStepperStorage}
      />
    );
  }
  if (currentStep?.type === 'buttonAction') {
    return (
      <ButtonAction
        {...currentStep}
        goToNext={goToNext}
        setStepperStorage={setStepperStorage}
        stepperStorage={stepperStorage}
      />
    );
  }
  return null;
};

export default StepperForm;
