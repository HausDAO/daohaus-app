import React from 'react';

const TokenSelect = ({ field, form: { touched, errors }, token, data, ...props }) => {
  
  const options = data.map((i) => (
    <option key={i.value} value={i.value}>
      {i.label}
    </option>
  ));
  return (
    <div className="TokenSelect">

      <select value={field.value} {...field}>
        {options}
      </select>


    </div>
  );
};

export default TokenSelect;
