import React from 'react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import GenericInput from './genericInput';
import ModButton from './modButton';

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
      btn={<ModButton text={btnDisplay()} fn={setMax} />}
    />
  );
};

export default RageInput;
