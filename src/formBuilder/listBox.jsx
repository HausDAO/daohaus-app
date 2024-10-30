import React, { useState, useEffect } from 'react';
import GenericTextarea from './genericTextArea';

const pluralize = (str, count) => {
  if (!str || !count) return;
  return count === 1 ? str : `${str}s`;
};

const ListBox = props => {
  const { localForm, name } = props;
  const { watch } = localForm;
  const listItems = watch(name);
  const [numValues, setNumValues] = useState(0);

  useEffect(() => {
    if (listItems) {
      setNumValues(listItems?.length);
    }
  }, [listItems]);
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
      helperText={
        numValues
          ? `${numValues} ${pluralize('item', numValues)}`
          : 'Values must be separated by a comma or a new line '
      }
    />
  );
};

export default ListBox;
