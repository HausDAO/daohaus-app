import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Box, Flex } from '@chakra-ui/layout';
import { useFormModal, useOverlay } from '../contexts/OverlayContext';
import FormBuilder from './formBuilder';
import BoostDetails from '../components/boostDetails';
import Signer from '../components/signer';
import TheSummoner from '../components/theSummoner';
import BoostMetaForm from './boostMetaForm';
import TheLauncher from '../components/theLauncher';
import DiscordNotificationsLaunch from './discordLaunchForm';
import { MINION_CONTENT } from '../data/minions';

const getStepTitle = (currentStep, props) => {
  console.log(`currentStep`, currentStep);
  console.log(`props`, props);
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
  const { closeModal } = useFormModal();
  const { errorToast } = useOverlay();

  const [currentStep, setCurrentStep] = useState(
    Object.values(steps).find(step => step.start),
  );
  const [stepperStorage, setStepperStorage] = useState();

  const userSteps = useMemo(() => {
    if (steps) {
      return Object.values(steps)
        .filter(step => step.isUserStep)
        .map((step, index) => ({ ...step, position: index + 1 }));
    }
    return [];
  }, [steps]);

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

  const secondaryBtn = {
    text: 'Cancel',
    fn: () => closeModal(),
  };

  if (currentStep?.type === 'form') {
    return (
      <FormBuilder
        {...currentStep.form}
        parentForm={parentForm}
        goToNext={goToNext}
        next={currentStep.next}
        ctaText={currentStep.ctaText || 'Next'}
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
        setStepperStorage={setStepperStorage}
        secondaryBtn={secondaryBtn}
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
        {...currentStep}
        localForm={parentForm}
        next={currentStep.next}
        minionData={minionData}
        goToNext={goToNext}
        boostContent={boostContent}
        secondaryBtn={secondaryBtn}
      />
    );
  }
  if (currentStep?.type === 'launcher') {
    return (
      <TheLauncher
        {...currentStep}
        localForm={parentForm}
        next={currentStep.next}
        goToNext={goToNext}
        boostContent={boostContent}
        secondaryBtn={secondaryBtn}
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
        // parentForm={parentForm}
        metaFields={metaFields}
        goToNext={goToNext}
        setStepperStorage={setStepperStorage}
        secondaryBtn={secondaryBtn}
      />
    );
  }
  return null;

  // if (userSteps?.length && position > 0)
  //   return (
  //     <Flex flexDir='column'>
  //       <Box
  //         fontFamily='heading'
  //         textTransform='uppercase'
  //         fontSize='sm'
  //         fontWeight={700}
  //         color='secondary.400'
  //         mb={2}
  //       >
  //         {`Step ${position} of ${userSteps.length}`}
  //         {currentStep?.stepLabel && `: ${currentStep.stepLabel}`}
  //       </Box>
  //       {getFrame()}
  //     </Flex>
  //   );
};

export default StepperForm;
