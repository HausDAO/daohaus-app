import React from 'react';

import { Link } from 'react-router-dom';

const FourOhFour = () => {
  return (
    <div className="View">
      You seem to be lost.
      <Link to="/">Go back home.</Link>
    </div>
  );
};

export default FourOhFour;
