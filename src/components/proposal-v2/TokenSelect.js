import React, { useEffect, useState } from 'react';

const TokenSelect = ({ field, form: { touched, errors }, token, data, ...props }) => {
  const [balance, setBalance] = useState(0)
  const [symbol, setSymbol] = useState()
  useEffect(() => {
    const runCheck = async () => {
      const selected = data.find((item) => item.value === token)
      if (selected) {
        setBalance((selected.balance / 10 ** selected.decimals).toFixed(4));
        setSymbol(selected.label);
      }
    };
    runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const options = data.map((i) => (
    <option key={i.value} value={i.value}>
      {i.label} 
    </option>
  ));
  return (
    <div className="TokenSelect">
      {token && <p>Banks Balance: {balance} {symbol}</p>}
      <select value={field.value} {...field}>
        {options}
      </select>
    </div>
  );
};

export default TokenSelect;
