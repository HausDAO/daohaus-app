import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DaoService } from '../utils/dao-service';
import { get } from '../utils/requests';

import { useLoading, useUser, useDao, useWeb3Connect } from './PokemolContext';

const DaoInit = () => {
  const location = useLocation();
  const [dao, updateDao] = useDao();
  const [web3Connect] = useWeb3Connect();
  const [, updateLoading] = useLoading();
  const [user] = useUser();

  useEffect(() => {
    var pathname = location.pathname.split('/');
    const daoParam = pathname[2];
    const regex = RegExp('0x[0-9a-f]{10,40}');
    const validParam =
      pathname[1] === 'dao' && regex.test(daoParam) ? daoParam : false;

    if (!validParam) {
      updateDao(null);
      return;
    }

    if (!dao || dao.address !== daoParam) {
      initDao(daoParam);
    }
    // eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    const needsUserDaoService =
      dao && user && user.username !== dao.daoService.accountAddr;
    if (needsUserDaoService) {
      initWeb3DaoService();
    }

    // eslint-disable-next-line
  }, [user, dao]);

  const initDao = async (daoParam) => {
    // console.log('###############init dao');
    updateLoading(true);

    let daoRes;
    try {
      daoRes = await get(`moloch/${daoParam}`);
    } catch (err) {
      console.log('api fetch error', daoParam);
    }

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

    const version = daoRes && daoRes.data.version ? daoRes.data.version : '1';
    const daoService =
      user && web3Connect.provider
        ? await DaoService.instantiateWithWeb3(
            user.username,
            web3Connect.provider,
            daoParam,
            version,
          )
        : await DaoService.instantiateWithReadOnly(daoParam, version);

    const currentPeriod = await daoService.moloch.getCurrentPeriod();

    updateDao({
      ...dao,
      address: daoParam,
      apiMeta: daoRes ? daoRes.data : null,
      daoService: daoService,
      boosts,
      currentPeriod: parseInt(currentPeriod),
    });
    updateLoading(false);
  };

  const initWeb3DaoService = async () => {
    const daoService = await DaoService.instantiateWithWeb3(
      user.username,
      web3Connect.provider,
      dao.address,
      dao.version,
    );

    updateDao({
      ...dao,
      daoService,
    });
  };

  return <></>;
};

export default DaoInit;
