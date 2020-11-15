import React from 'react';
import { Button, Heading } from '@chakra-ui/core';
import { useDao, useUser, useWeb3Connect } from '../../contexts/PokemolContext';

const Boosts = () => {
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();
  const [dao] = useDao();

  const summonMinion = () => {
    console.log('summon', dao, user, web3Connect);
    // sommon minion
    // make proposal to add to metadata?
  };

  return (
    <>
      <Heading as='h3' size='lg'>
        DAO Boosts
      </Heading>
      <Button onClick={summonMinion}>New Minion</Button>
    </>
  );
};

export default Boosts;
