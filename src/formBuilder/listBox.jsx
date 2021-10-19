import React, { useEffect } from 'react';
import GenericTextarea from './genericTextArea';

const ListBox = props => {
  const { localForm, name } = props;
  const { watch } = localForm;
  const text = watch(name);

  useEffect(() => {
    console.log(text);
  }, [text]);

  return (
    <GenericTextarea {...props} helperText='Must be a comma separated list' />
  );
};

export default ListBox;
