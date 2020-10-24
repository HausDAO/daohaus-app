import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DaoService } from '../utils/DaoService';
import { get } from '../utils/Requests';

import { PokemolContext } from './PokemolContext';

const DaoInit = () => {
  const location = useLocation();
  const { state, dispatch } = useContext(PokemolContext);

  useEffect(() => {
    var pathname = location.pathname.split('/');
    const daoParam = pathname[2];
    const regex = RegExp('0x[0-9a-f]{10,40}');
    const validParam =
      pathname[1] === 'dao' && regex.test(daoParam) ? daoParam : false;

    if (validParam) {
      initDao(daoParam);
    }

    // TODO: Does this also need to fire on web3 or user change to reinit daoservice?

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, state.web3]);

  const initDao = async (daoParam) => {
    console.log('INIT ', daoParam);

    let daoRes;
    try {
      daoRes = await get(`moloch/${daoParam}`);
    } catch (err) {
      console.log('api fetch error', daoParam);
    }

    console.log('state.web3', state.web3);

    const version = daoRes ? daoRes.data.version : '1';
    const daoService =
      state.user && state.web3.provider
        ? await DaoService.instantiateWithWeb3(
            state.user.username,
            state.web3.provider,
            daoParam,
            version,
          )
        : await DaoService.instantiateWithReadOnly(daoParam, version);

    // TODO: what all do we want on this and where else will we set it?
    // get boost res here too
    dispatch({
      type: 'setDao',
      payload: {
        address: daoParam,
        apiMeta: daoRes ? daoRes.data : null,
        daoService: daoService,
      },
    });
  };

  return <></>;
};

export default DaoInit;
