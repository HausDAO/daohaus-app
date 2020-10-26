import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDaoData } from '../../contexts/PokemolContext';

const Dao = () => {
  const location = useLocation();
  const dao = useDaoData();
  console.log('location', location);
  console.log('dao', dao);
  return <div>Dao</div>;
};

export default Dao;
