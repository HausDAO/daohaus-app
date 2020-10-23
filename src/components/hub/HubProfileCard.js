import React, { useContext } from 'react';
import { PokemolContext } from '../../contexts/PokemolContext';

const HubProfileCard = () => {
  const { state } = useContext(PokemolContext);
  return <div>HubProfileCard</div>;
};

export default HubProfileCard;
