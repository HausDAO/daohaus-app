import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="Error">
      <p>There was an error :(</p>
      {/* <p>{message}</p> */}
    </div>
  );
};

export default ErrorMessage;
