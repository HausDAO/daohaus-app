import React, { useContext } from 'react';
import TextBox from '../components/TextBox';
import { OverlayContext } from '../contexts/OverlayContext';
import FormBuilder from '../formBuilder/formBuilder';
import StepperForm from '../formBuilder/StepperForm';

const MODAL_SIZES = Object.freeze({
  sm: '400px',
  md: '550px',
  lg: '650px',
  xl: '800px',
});

const calcMaxWidth = data => {
  if (data?.fields?.length)
    return data.fields.length > 1 ? MODAL_SIZES.xl : MODAL_SIZES.md;
  if (MODAL_SIZES[data?.width]) return MODAL_SIZES[data?.width];
  return '650px';
};

export const useAppModal = () => {
  const { setModal, closeModal } = useContext(OverlayContext);

  return {
    formModal(form) {
      setModal({
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        body: <FormBuilder {...form} />,
        width: form.customWidth || calcMaxWidth(form),
      });
    },
    stepperModal(steps) {
      setModal({
        title: steps.title,
        subtitle: steps.subtitle,
        body: <StepperForm {...steps} />,
        width: calcMaxWidth(steps),
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
    }) {
      const submitBtn = { text: 'Submit', fn: onSubmit };
      const cancelBtn = { text: 'Close', fn: onCancel || closeModal };
      const footer = {
        primaryBtn: primaryBtn || submitBtn,
        secondaryBtn: secondaryBtn || cancelBtn,
      };
      setModal({
        title,
        subtitle,
        body: body || <TextBox variant='body'>{description}</TextBox>,
        footer,
      });
    },
    genericModal(params) {
      setModal(params);
    },
    closeModal,
  };
};
