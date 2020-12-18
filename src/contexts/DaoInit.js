import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Web3Modal from 'web3modal';

import { defaultTheme } from '../themes/theme-defaults';
import { providerOptions, setWeb3Connect } from '../utils/auth';
import { getChainDataByName } from '../utils/chains';
import { DaoService, USER_TYPE } from '../utils/dao-service';
import { validDaoParams } from '../utils/helpers';
import { get } from '../utils/requests';
import { useTheme } from './CustomThemeContext';

import {
  useUser,
  useWeb3Connect,
  useMemberWallet,
  useContracts,
  useDaoMetadata,
  useDao,
  useNetwork,
} from './PokemolContext';

const DaoInit = () => {
  const location = useLocation();
  const [contracts, updateContracts] = useContracts();
  const [, updateNetwork] = useNetwork();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();
  const [, setTheme] = useTheme();
  const [web3Connect, updateWeb3Connect] = useWeb3Connect();
  const [memberWallet, updateMemberWallet] = useMemberWallet();
  const [user, updateUser] = useUser();
  const [, clearDaoData] = useDao();

  useEffect(() => {
    const validParam = validDaoParams(location);
    if (!validParam) {
      clearDaoData();
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

    if (
      hasUserAndDao &&
      hasReadOnlyService &&
      web3Connect.provider &&
      !web3Connect.mismatch
    ) {
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
    console.log('***** initDao');
    let daoRes;
    try {
      daoRes = await get(`dao/${daoParam}`);
    } catch (err) {
      console.log('api fetch error', daoParam);
    }
    const apiData = daoRes.error ? {} : daoRes;
    const daoNetwork = getChainDataByName(apiData.network || 'mainnet');

    console.log('**** setting network DAOINIT', daoNetwork);
    updateNetwork(daoNetwork);

    let boosts = {};
    if (apiData.boosts) {
      boosts = apiData.boosts.reduce((boosts, boostData) => {
        boosts[boostData.boostKey] = {
          active: boostData.active,
          metadata: boostData.boostMetadata,
        };
        return boosts;
      }, {});
    }

    if (boosts.customTheme?.active) {
      const themeUpdate = { ...defaultTheme, ...boosts.customTheme.metadata };
      setTheme(themeUpdate);
    } else {
      setTheme(defaultTheme);
    }

    const uiMeta = boosts.customTheme
      ? boosts.customTheme.metadata
      : defaultTheme.daoMeta;

    // TODO: REMOVE V1 code
    // const version = daoRes && daoRes.data.version ? daoRes.data.version : '1';

    const version = 2;
    const daoService =
      user && web3Connect.provider
        ? await DaoService.instantiateWithWeb3(
            user.username,
            web3Connect.provider,
            daoParam,
            version,
            daoNetwork,
          )
        : await DaoService.instantiateWithReadOnly(
            daoParam,
            version,
            daoNetwork,
          );

    updateDaoMetadata({
      address: daoParam,
      version,
      ...apiData,
      boosts,
      uiMeta,
    });

    updateContracts({ daoService });
  };

  const initWeb3DaoService = async () => {
    console.log('^^^^^ initWeb3DaoService');
    const daoNetwork = getChainDataByName(daoMetadata.network || 'mainnet');
    // console.log('initint web 3 service w/ user', web3Connect, daoNetwork);

    let provider = web3Connect.provider;

    if (daoNetwork.network !== web3Connect.w3c.providerController.network) {
      const newWeb3Connect = await setWeb3Connect(daoNetwork);
      provider = newWeb3Connect.provider;
      console.log(
        '@@@@@@@@@@@@@@@@setting up new provider on mismatch provider',
        provider,
      );
      updateWeb3Connect({ ...newWeb3Connect, mismatch: true });
      updateUser(null);
    }

    // console.log('provider', provider);
    const daoService = await DaoService.instantiateWithWeb3(
      user.username,
      provider,
      daoMetadata.address,
      daoMetadata.version,
    );

    console.log('daoService', daoService);

    updateContracts({ daoService });
  };

  const initMemberWallet = async () => {
    console.log('****initMemberWallet');

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
