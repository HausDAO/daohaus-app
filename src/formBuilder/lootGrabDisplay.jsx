import React, { useEffect, useState } from 'react';
import { useMetaData } from '../contexts/MetaDataContext';
import GenericFormDisplay from './genericFormDisplay';

const LootGrabDisplay = props => {
  const { daoMetaData } = useMetaData();
  const { localForm } = props;
  const { watch } = localForm;
  const [daoRatio, setDaoRatio] = useState('loading');
  const [lootRequested, setLootRequested] = useState(null);

  const tributeOffered = watch('tributeOffered');

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
      setLootRequested(Number(tributeOffered) * daoRatio);
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
      <GenericFormDisplay {...props} override={lootRequested} variant='value' />
    </>
  );
};

export default LootGrabDisplay;
