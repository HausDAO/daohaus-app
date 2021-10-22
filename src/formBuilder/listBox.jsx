import React from 'react';
import GenericTextarea from './genericTextArea';

const ListBox = props => (
  <GenericTextarea
    {...props}
    registerOptions={{
      setValueAs: value =>
        value
          .split(/[\n|,]/)
          .map(str => str.trim())
          .filter(Boolean),
    }}
    helperText='Must be a comma separated list'
  />
);

export default ListBox;
