import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { DaoServiceContext } from '../../contexts/Store';

const FourOhFour = () => {
  const [daoService] = useContext(DaoServiceContext);
  return (
    <div>
      You seem to be lost.
      <Link to={`/dao/${daoService.contractAddr}`}>Go back home.</Link>
    </div>
  );
};

export default FourOhFour;
