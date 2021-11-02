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
      'This is some untested, alpha stage, super-user shit right here. So do us a favour and check each field and test with a small TX before accidentally aping the whole vault into the zero address.',
  },
};
