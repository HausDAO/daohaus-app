import React, { useContext, useState, useEffect } from 'react';
import { DaoServiceContext } from '../../contexts/Store';
import TinyLoader from '../shared/TinyLoader';

import { FieldContainer } from '../../App.styles';

const TributeInput = ({
  field,
  form: { touched, errors },
  token,
  ...props
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [daoService] = useContext(DaoServiceContext);

  const unlock = async (token) => {
    setLoading(true);
    const ul = await daoService.token.unlock(token);
    console.log(ul);

    setUnlocked(true);
    setLoading(false);
  };

  const checkUnlocked = async (token, amount) => {
    console.log('checkUnlocked', token, amount);
    if (amount === '') {
      return;
    }
    const amountApproved = await daoService.token.unlocked(token);
    console.log(amountApproved, amount);
    // this needs to check token decimals
    const isUnlocked = amountApproved > amount;
    setUnlocked(isUnlocked);
  };

  const getMax = async (token) => {
    const max = await daoService.token.balanceOfToken(token);
    setBalance(max);
  };

  useEffect(() => {
    const runCheck = async () => {
      await checkUnlocked(token, field.value);
      await getMax(token);
      return true;
    };
    runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <FieldContainer
      className={field.value !== '' ? 'Field HasValue' : 'Field '}
    >
      <label>{props.label}</label>
      <input
        type="number"
        {...field}
        {...props}
        onBlur={(e) => {
          field.onBlur(e);
          checkUnlocked(token, field.value);
        }}
      />
      <div className="MaxLabel">Max: {balance.toFixed(4)}</div>
      {field.value && field.value !== 0 && !unlocked ? (
        <div className="UnlockButton" onClick={() => unlock(token)}>
          {!loading ? <span>! Unlock </span> : <TinyLoader />}
        </div>
      ) : null}
    </FieldContainer>
  );
};

export default TributeInput;
