import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Box, Flex } from '@chakra-ui/layout';
import { useFormModal, useOverlay } from '../contexts/OverlayContext';
import FormBuilder from './formBuilder';
import BoostDetails from '../components/boostDetails';
import Signer from '../components/signer';
import TheSummoner from '../components/theSummoner';

const StepperForm = props => {
  const { steps = {}, minionData, boostContent, playlist, isAvailable } = props;
  const parentForm = useForm({ shouldUnregister: false });
  const { closeModal } = useFormModal();
  const { errorToast } = useOverlay();

  const [currentStep, setCurrentStep] = useState(
    Object.values(steps).find(step => step.start),
  );
  const [position, setPosition] = useState(0);

  //  User steps are the amount of percieved steps to finish a given tasl
  //  regular steps tell the app which frame to render, (ex. BoostDetails)
  //  userSteps tell the users the steps they will have to perform
  //  (ex. form, summoner, or signer)

  const userSteps = useMemo(() => {
    if (steps) {
      return Object.values(steps)
        .filter(step => step.isUserStep)
        .map((step, index) => ({ ...step, position: index + 1 }));
    }
    return [];
  }, [steps]);

  useEffect(() => {
    if (!currentStep || !userSteps) return;
    if (currentStep.isUserStep) {
      setPosition(
        userSteps.find(step => step.stepLabel === currentStep.stepLabel)
          ?.position,
      );
    }
  }, [currentStep, userSteps]);

  const goToNext = () => {
    if (currentStep.finish) {
      closeModal();
    } else if (currentStep.next) {
      const nextStep = steps[currentStep.next];
      if (nextStep) {
        setCurrentStep(nextStep);
      } else {
        errorToast({
          title: 'Next step does not match any other steps',
          description:
            'Check the steps and make sure the "next" key links to a valid step',
        });
      }
    } else {
      errorToast({
        title: 'Next step is undefined or falsy',
      });
    }
  };

  const getFrame = () => {
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
    if (currentStep?.type === 'boostDetails') {
      return (
        <BoostDetails
          content={boostContent}
          isAvailable={isAvailable}
          goToNext={goToNext}
          next={currentStep.next}
          userSteps={userSteps}
          steps={steps}
        />
      );
    }
    if (currentStep?.type === 'summoner') {
      return (
        <TheSummoner
          {...currentStep}
          localForm={parentForm}
          next={currentStep.next}
          minionData={minionData}
          goToNext={goToNext}
          boostContent={boostContent}
        />
      );
    }
    if (currentStep?.type === 'signer') {
      return (
        <Signer
          {...currentStep}
          boostData={props}
          next={currentStep.next}
          goToNext={goToNext}
          playlist={playlist}
        />
      );
    }
    return null;
  };
  return (
    <Flex flexDir='column'>
      <Box
        fontFamily='heading'
        textTransform='uppercase'
        fontSize='xs'
        fontWeight={700}
        color='#7579C5'
        my={4}
      >
        Step {position} of {userSteps.length}
      </Box>
      {getFrame()}
    </Flex>
  );
};

export default StepperForm;
