import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { CurrentUserContext, DaoServiceContext } from '../../contexts/Store';

const SignOut = () => {
  const [, setCurrentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoServiceContext);

  useEffect(() => {
    const currentUser = async () => {
      try {
        setCurrentUser();
        localStorage.clear();
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    };

    currentUser();
  }, [setCurrentUser]);

  return <Redirect to={`/dao/${daoService.daoAddress}/`} />;
};

export default SignOut;
