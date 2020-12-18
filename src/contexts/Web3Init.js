import React, { useEffect } from 'react';

import { useWeb3Connect } from './PokemolContext';

const Web3Init = () => {
  const [web3Connect, updateWeb3Connect] = useWeb3Connect();

  useEffect(() => {
    initCurrentUser();
    initDao();

    // also init dao if dao param

    // user reinit on dao param - if network doesn't match and also do the user wallet

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [web3Connect, network]);
  }, []);

  const initCurrentUser = async () => {
    // toggle userinit this based on dao param - if dao param we wait on dao actions
    // no dao param - we look at local/injected
    // also trigger this on connect button click or does that do it's own thing?
  };

  const initDao = async () => {
    // when we have a dao param
    // use readonly daoservice
    // should we put all the contract services in it's own spot here?
    // any contracts needed outside of dao?
  };

  const initUserWallet = async () => {
    // when we have a dao + user + dao/user network match
    // and reinit the daoservice (and other contract services?)
  };

  const initContractServices = () => {
    // called from others.
    // readonly and web3connect versions
  };

  return <></>;
};

export default Web3Init;
