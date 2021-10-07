import React, { useContext } from 'react';
import { Flex } from '@chakra-ui/react';

import { OverlayContext } from '../contexts/OverlayContext';
import FormBuilder from '../formBuilder/formBuilder';
import MultiForm from '../formBuilder/multiForm';
import StepperForm from '../formBuilder/StepperForm';
import TextBox from '../components/TextBox';

const MODAL_SIZES = Object.freeze({
  sm: '400px',
  md: '500px',
  lg: '600px',
  xl: '800px',
});

const calcMaxWidth = data => {
  if (data?.fields?.length)
    return data.fields.length > 1 ? MODAL_SIZES.xl : MODAL_SIZES.md;
  if (MODAL_SIZES[data?.width]) return MODAL_SIZES[data?.width];
  return '600px';
};

export const useAppModal = () => {
  const { setModal, closeModal } = useContext(OverlayContext);

  return {
    formModal(form) {
      if (form.type === 'multiForm') {
        setModal({
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          body: <MultiForm {...form} />,
          width: form.customWidth || calcMaxWidth(form),
        });
      } else if (form.type === 'multiStep') {
        const updateModalUI = ({ subtitle, title }) => {
          setModal(prevState => ({ ...prevState, subtitle, title }));
        };
        setModal({
          body: <StepperForm steps={form} updateModalUI={updateModalUI} />,
          width: form.customWidth || calcMaxWidth(form),
        });
      } else {
        setModal({
          title: form.title,
          subtitle: form.subtitle || form.type,
          description: form.description,
          body: <FormBuilder {...form} />,
          width: form.customWidth || calcMaxWidth(form),
        });
      }
    },
    devFormModal(form) {
      setModal({
        title: form.title,
        subtitle: form.subtitle || form.type,
        description: form.description,
        body: (
          <Flex>
            <FormBuilder {...form} />
          </Flex>
        ),
        width: '100%',
      });
    },
    stepperModal(steps) {
      const updateModalUI = ({ subtitle, title }) => {
        setModal(prevState => ({ ...prevState, subtitle, title }));
      };
      setModal({
        body: <StepperForm steps={steps} updateModalUI={updateModalUI} />,
        width: steps.customWidth || calcMaxWidth(steps),
      });
    },
    boostModal(boost) {
      const updateModalUI = ({ subtitle, title }) => {
        setModal(prevState => ({ ...prevState, subtitle, title }));
      };
      setModal({
        body: (
          <StepperForm
            steps={boost.steps}
            updateModalUI={updateModalUI}
            {...boost}
          />
        ),
      });
    },
    confirmModal({
      title,
      subtitle,
      description,
      body,
      primaryBtn,
      secondaryBtn,
      onCancel,
      onSubmit,
      customWidth,
    }) {
      const submitBtn = { text: 'Submit', fn: onSubmit };
      const cancelBtn = { text: 'Cancel', fn: onCancel || closeModal };
      const footer = {
        primaryBtn: primaryBtn || submitBtn,
        secondaryBtn: secondaryBtn || cancelBtn,
      };

      setModal({
        title,
        subtitle,
        body: body || (
          <TextBox variant='body' size='sm' mb={2}>
            {description}
          </TextBox>
        ),
        footer,
        width: customWidth || 'lg',
      });
    },
    genericModal(params) {
      setModal(params);
    },

    closeModal,
  };
};
