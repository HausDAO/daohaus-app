import React from 'react';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { ModButton } from './staticElements';
import GenericInput from './genericInput';

const RageInput = props => {
  const { daoMember } = useDaoMember();
  const { localForm, name } = props;
  const { setValue } = localForm;

  const btnDisplay = () => {
    if (daoMember[name]) return `Max: ${daoMember[name]}`;
    return '0';
  };

  const setMax = () => {
    setValue(name, daoMember[name]);
  };

  return (
    <GenericInput
      {...props}
      btn={<ModButton label={btnDisplay()} callback={setMax} />}
    />
  );
};

export default RageInput;
