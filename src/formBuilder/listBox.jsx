import React, { useEffect, useState } from 'react';
import { omit } from '../utils/general';
import GenericTextarea from './genericTextArea';

const ListBox = props => {
  const { localForm, name } = props;
  const { watch, register, setValue, control } = localForm;

  const [isFormat, setIsFormat] = useState(null);
  const [helperText, setHelperText] = useState(null);
  // const modName = `MOD${name}`;
  const text = watch(name);

  useEffect(() => {
    // if (text) {
    //   const formattedArray = text
    //   if (Array.isArray(formattedArray)) {
    //     register(name);
    //     setValue(name, formattedArray);
    //   }
    // }
  }, [text]);

  return (
    <GenericTextarea
      {...props}
      registerOptions={{
        setValueAs: value =>
          value
            .split(/[\n|,]/)
            .map(str => str.trim())
            .filter(Boolean),
      }}
      // register={{ ...register(name) }}
      helperText='Must be a comma separated list'
    />
  );
};

export default ListBox;
