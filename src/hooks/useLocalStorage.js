import { useState, useEffect } from 'react';

function useLocalStorage(key, defaultVal) {
  // make piece of state, based off of value in localstorage

  const [state, setState] = useState(() => {
    let val;
    try {
      val = JSON.parse(window.localStorage.getItem(key) || String(defaultVal));
    } catch (e) {
      val = defaultVal;
    }
    return val;
  });

  // useEffect to update local Storage once state changes
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}

export default useLocalStorage;
