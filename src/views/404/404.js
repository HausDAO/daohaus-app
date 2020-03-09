import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { DaoServiceContext } from '../../contexts/Store';

const FourOhFour = () => {
  const [daoService] = useContext(DaoServiceContext);
  return (
    <div className="View">
      You seem to be lost.
      <Link to={`/dao/${daoService.daoAddress}`}>Go back home.</Link>
    </div>
  );
};

export default FourOhFour;
