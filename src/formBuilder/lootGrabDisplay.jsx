import React, { useEffect, useState } from 'react';

import { useMetaData } from '../contexts/MetaDataContext';
import GenericFormDisplay from './genericFormDisplay';

const LootGrabDisplay = props => {
  const { daoMetaData } = useMetaData();
  const { localForm, fallback } = props;
  const { watch, setValue } = localForm;
  const [daoRatio, setDaoRatio] = useState('loading');
  const [lootRequested, setLootRequested] = useState(null);

  const tributeOffered = watch('tributeOffered');

  useEffect(() => {
    setValue('title', 'Loot grab proposal');
  }, []);

  useEffect(() => {
    const ratio = daoMetaData?.boosts?.proposalTypes?.metadata?.lootGrab?.ratio;
    if (ratio) {
      setDaoRatio(Number(ratio));
    } else {
      setDaoRatio('0');
    }
  }, [daoMetaData]);

  useEffect(() => {
    if (tributeOffered && daoRatio) {
      const value = Math.floor(
        Number(tributeOffered) * Number(daoRatio),
      ).toString();
      setLootRequested(value);
      setValue('lootRequested', value);
    } else if (tributeOffered === '') {
      setLootRequested(fallback);
    }
  }, [tributeOffered, daoRatio]);
  return (
    <>
      <GenericFormDisplay
        override={daoRatio}
        localForm={localForm}
        label='DAO ratio'
        name='daoRatio'
        variant='value'
      />
      <GenericFormDisplay
        {...props}
        override={lootRequested}
        variant='value'
        helperText='Can only be whole numbers'
      />
    </>
  );
};

export default LootGrabDisplay;
