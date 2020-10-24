import React from 'react';
import { useLocation } from 'react-router-dom';

const Dao = () => {
  const location = useLocation();
  console.log('location', location);
  return <div>Dao</div>;
};

export default Dao;
