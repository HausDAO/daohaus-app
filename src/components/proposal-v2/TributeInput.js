import React, { useContext, useState, useEffect } from 'react';
import { DaoServiceContext } from '../../contexts/Store';
import TinyLoader from '../shared/TinyLoader';

const TributeInput = ({
  field,
  form: { touched, errors },
  token,
  ...props
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [daoService] = useContext(DaoServiceContext);

  const unlock = async (token) => {
    console.log('unlock ', token);
    setLoading(true);
    const ul = await daoService.token.unlock(token);
    console.log(ul);

    setUnlocked(true);
    setLoading(false);
  };

  const checkUnlocked = async (token, amount) => {
    if (amount === '') {
      return;
    }
    console.log('check unlocked', token, amount);
    console.log('unlock props ', props);

    const amountApproved = await daoService.token.unlocked(token);
    const isUnlocked = amountApproved > amount;
    setUnlocked(isUnlocked);
  };

  useEffect(() => {
    const runCheck = async () => {
      console.log('checking unlocked');

      await checkUnlocked(token, field.value);
      return true;
    };
    runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className={field.value !== '' ? 'Field HasValue' : 'Field '}>
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
      {field.value && field.value !== 0 && !unlocked ? (
        <div className="UnlockButton" onClick={() => unlock(token)}>
          {!loading ? <span>! Unlock</span> : <TinyLoader />}
        </div>
      ) : null}
    </div>
  );
};

export default TributeInput;
