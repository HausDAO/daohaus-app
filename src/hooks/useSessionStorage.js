import { useState, useEffect } from 'react';

export const useSessionStorage = (key, defaultVal) => {
  const [state, setState] = useState(() => {
    let val;
    try {
      val = JSON.parse(
        window.sessionStorage.getItem(key) || String(defaultVal),
      );
    } catch (e) {
      val = defaultVal;
    }
    return val;
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.log('SESSION STORAGE FULL');
      console.log('clearing session storage');
      sessionStorage.clear();
    }
  }, [state, key]);

  return [state, setState];
};
