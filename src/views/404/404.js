import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { DaoContext } from '../../contexts/Store';

const FourOhFour = () => {
  const [daoService] = useContext(DaoContext);
  return (
    <div>
      You're lost member.{' '}
      <Link to={`/dao/${daoService.contractAddr}`}>Go back home.</Link>
    </div>
  );
};

export default FourOhFour;
