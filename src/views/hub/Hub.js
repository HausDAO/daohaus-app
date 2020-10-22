import React, { useContext } from 'react';
import { Button } from '@chakra-ui/core';
import { PokemolContext } from '../../contexts/PokemolContext';

const Hub = () => {
  const { dispatch } = useContext(PokemolContext);

  const setTheme = () => {
    dispatch({
      type: 'setTheme',
      payload: {
        brand100: '#2C7A7B',
        brand200: '#81E6D9',
        brandImg: '',
      },
    });
  };

  const setDefault = () => {
    dispatch({
      type: 'clearTheme',
    });
  };

  return (
    <div>
      i am HUB content
      <Button onClick={setTheme}> PRETEND DAO BUTTON</Button>
      <Button onClick={setDefault}> DEFAULT</Button>
    </div>
  );
};

export default Hub;
