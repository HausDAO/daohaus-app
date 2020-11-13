import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  useUser,
  useWeb3Connect,
  useContracts,
  useDaoMetadata,
} from './PokemolContext';

const DaoInit = () => {
  const location = useLocation();
  const [contracts] = useContracts();
  const [daoMetadata] = useDaoMetadata();
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();

  //   const initWeb3DaoService = async () => {
  //     const daoService = await DaoService.instantiateWithWeb3(
  //       user.username,
  //       web3Connect.provider,
  //       daoMetadata.address,
  //       daoMetadata.version,
  //     );

  //     updateContracts({ daoService });
  //   };

  return <></>;
};

export default DaoInit;
