import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GenericSelect from './genericSelect';
import { getAvailableCrossChainIds } from '../utils/gnosis';

const ForeignChainSelect = props => {
  const { boostId, localForm, name, values } = props;
  const { setValue, watch } = localForm;
  const { daochain } = useParams();
  const [defaultValue, setDefaultValue] = useState();
  const [networks, setAvailableNetworks] = useState();

  const selectedValue = watch(name);

  useEffect(() => {
    const { zodiacModule, availableNetworks } = getAvailableCrossChainIds(
      boostId,
      daochain,
      values.minionType,
    );
    setValue('zodiacAction', zodiacModule);
    setAvailableNetworks(availableNetworks);
    if (selectedValue) {
      setDefaultValue(selectedValue);
    }
  }, []);

  useEffect(() => {
    if (!selectedValue && defaultValue) {
      setValue(name, defaultValue);
    }
  }, [selectedValue]);

  return <GenericSelect options={networks} {...props} />;
};

export default ForeignChainSelect;
