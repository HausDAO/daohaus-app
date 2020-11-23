import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { defaultTheme } from '../themes/theme-defaults';
import { DaoService, USER_TYPE } from '../utils/dao-service';
import { validDaoParams } from '../utils/helpers';
import { get } from '../utils/requests';

import {
  useUser,
  useWeb3Connect,
  useMemberWallet,
  useContracts,
  useDaoMetadata,
} from './PokemolContext';

const DaoInit = () => {
  const location = useLocation();
  const [contracts, updateContracts] = useContracts();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();
  const [web3Connect] = useWeb3Connect();
  const [memberWallet, updateMemberWallet] = useMemberWallet();
  const [user] = useUser();

  useEffect(() => {
    const validParam = validDaoParams(location);
    if (!validParam) {
      updateDaoMetadata(null);
      return;
    }

    if (!daoMetadata || daoMetadata.address !== validParam) {
      initDao(validParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    const hasUserAndDao = user && daoMetadata;
    const hasReadOnlyService =
      contracts.daoService && !contracts.daoService.accountAddr;

    if (hasUserAndDao && hasReadOnlyService && web3Connect.provider) {
      initWeb3DaoService();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, daoMetadata, contracts, web3Connect]);

  useEffect(() => {
    const noDaoService =
      !daoMetadata ||
      !contracts.daoService ||
      !contracts.daoService.accountAddr;
    const notSignedIn = !user || user.type === USER_TYPE.READ_ONLY;
    if (noDaoService || notSignedIn) {
      return;
    }

    const walletExists =
      memberWallet &&
      memberWallet.daoAddress === contracts.daoService.daoAddress;
    if (!walletExists) {
      initMemberWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoMetadata, user, contracts]);

  const initDao = async (daoParam) => {
    let daoRes;
    try {
      daoRes = await get(`moloch/${daoParam}`);
    } catch (err) {
      console.log('api fetch error', daoParam);
    }
    const apiData = daoRes ? daoRes.data : {};

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

    // this will need to parse custom theme data
    const uiMeta = defaultTheme.daoMeta;

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

    updateDaoMetadata({
      address: daoParam,
      version,
      ...apiData,
      boosts,
      uiMeta,
      currentPeriod: parseInt(currentPeriod),
    });

    updateContracts({ daoService });
  };

  const initWeb3DaoService = async () => {
    const daoService = await DaoService.instantiateWithWeb3(
      user.username,
      web3Connect.provider,
      daoMetadata.address,
      daoMetadata.version,
    );

    updateContracts({ daoService });
  };

  const initMemberWallet = async () => {
    const addrByDelegateKey = await contracts.daoService.moloch.memberAddressByDelegateKey(
      user.username,
    );
    const tokenBalanceWei = await contracts.daoService.token.balanceOf(
      user.username,
    );
    const allowanceWei = await contracts.daoService.token.allowance(
      user.username,
      contracts.daoService.daoAddress,
    );
    const tokenBalance = contracts.daoService.web3.utils.fromWei(
      tokenBalanceWei,
    );
    const allowance = contracts.daoService.web3.utils.fromWei(allowanceWei);
    const member = await contracts.daoService.moloch.members(addrByDelegateKey);
    const shares = parseInt(member.shares) || 0;
    const loot = parseInt(member.loot) || 0;
    const jailed = parseInt(member.jailed) || 0;
    const highestIndexYesVote = member.highestIndexYesVote;
    let eth = 0;
    eth = await contracts.daoService.getAccountEth();
    const wallet = {
      daoAddress: contracts.daoService.daoAddress,
      activeMember: member.exists && +member.jailed === 0,
      memberAddress: user.username,
      tokenBalance,
      allowance,
      eth,
      loot,
      highestIndexYesVote,
      jailed,
      shares,
      addrByDelegateKey,
    };

    updateMemberWallet(wallet);
  };

  return <></>;
};

export default DaoInit;
