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

    // TODO: test does useeffect need state.user too?
    const daoService =
      state.user && state.web3.provider
        ? await DaoService.instantiateWithWeb3(
            state.user.username,
            state.web3.provider,
            daoParam,
            version,
          )
        : await DaoService.instantiateWithReadOnly(daoParam, version);

    const boostRes = await get(`boosts/${daoParam}`);
    const boosts = boostRes.data.reduce((boosts, boostData) => {
      const metadata = boostData.metadata
        ? JSON.parse(boostData.metadata[0])
        : null;
      boosts[boostData.boostKey] = {
        active: boostData.active,
        metadata,
      };
      return boosts;
    }, {});

    console.log('boosts', boosts);

    // TODO: what all do we want on this and where else will we set it?

    dispatch({
      type: 'setDao',
      payload: {
        address: daoParam,
        apiMeta: daoRes ? daoRes.data : null,
        daoService: daoService,
        boosts,
      },
    });
  };

  return <></>;
};

export default DaoInit;
