import React from 'react';
import { validate } from '../utils/validation';
import GenericInput from './genericInput';

const TargetContract = props => {
  const { localForm } = props;

  const selectedMinion = localForm.watch('selectedMinion');
  // const targetContract = localForm.watch('targetContract');
  const isDisabled = !validate.address(selectedMinion);
  const getHelperText = () => {
    if (isDisabled) {
      return 'Please select a minion first';
    }
  };

  // useEffect(() => {
  //   if (targetContract && validate.address(targetContract)) {
  //     get();
  //   } else {
  //     setIsDisabled(true);
  //   }
  //   if(!targetContract && validate.address(targetContract)){

  //   }
  // }, [targetContract]);
  return (
    <GenericInput
      {...props}
      disabled={isDisabled}
      helperText={getHelperText()}
    />
  );
};

export default TargetContract;
