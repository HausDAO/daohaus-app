import React, { useEffect } from 'react';

import GenericTextArea from './genericTextArea';

const DisperseListInput = props => {
  const { localForm, name } = props;
  const { register, watch, setValue } = localForm;

  const rawAddressInput = watch('rawAddressList');

  useEffect(() => {
    register(name);
  }, []);

  useEffect(() => {
    if (rawAddressInput) {
      const filtered = rawAddressInput
        ?.split(/\r?\n/)
        .map(item => ({
          address: item.match(/0x[a-fA-F0-9]{40}/)?.[0],
          amount: Number(
            item.match(/(?<=(0x[a-fA-F0-9]{40}).)([0-9]+).*([0-9]*)/)?.[0],
          ),
        }))
        .filter(item => item.address && item.amount);

      if (filtered?.length > 0) {
        setValue(name, filtered);
      }
    }
  }, [rawAddressInput]);

  return <GenericTextArea {...props} name='rawAddressList' />;
};

export default DisperseListInput;
