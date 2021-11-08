import { BsCheckCircle } from 'react-icons/bs';
import { RiErrorWarningLine } from 'react-icons/ri';
import { BiErrorCircle } from 'react-icons/bi';

export const multiTXIndicatorStates = {
  loading: {
    spinner: true,
    title: 'Submitting...',
    explorerLink: true,
  },
  success: {
    icon: BsCheckCircle,
    title: 'Form Submitted',
    explorerLink: true,
  },
  error: {
    icon: BiErrorCircle,
    title: 'Error Submitting Transaction',
    errorMessage: true,
  },
  idle: {
    icon: RiErrorWarningLine,
    titleSm:
      'This feature is in alpha testing. Please check transactions carefully and test with small amounts before performing valuable or complicated transactions.',
  },
};
