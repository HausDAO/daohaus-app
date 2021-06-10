import React from 'react';

import GenericInput from './genericInput';

const LinkInput = props => {
  return <GenericInput {...props} prepend='https://' />;
};
export default LinkInput;
