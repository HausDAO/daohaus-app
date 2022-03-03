import React from 'react';
import { useParams } from 'react-router-dom';
import GenericSelect from './genericSelect';
import { chainByID } from '../utils/chain';

const ForeignChainSelect = props => {
  const { daochain } = useParams();
  const availableNetworks =
    chainByID(daochain).zodiac_amb_module?.foreign_networks || [];

  return <GenericSelect options={availableNetworks} {...props} />;
};

export default ForeignChainSelect;
