import React, { useEffect } from 'react';
import { useToast } from '@chakra-ui/core';
import { getProfile } from '3box/lib/api';

import { createWeb3User, w3connect } from '../utils/auth';
import { USER_TYPE } from '../utils/dao-service';
import {
  useUserWallet,
  useUser,
  useDao,
  useWeb3Connect,
} from './PokemolContext';

const UserInit = () => {
  const toast = useToast();
  const [dao] = useDao();
  const [web3Connect, updateWeb3Connect] = useWeb3Connect();
  const [user, updateUser] = useUser();
  const [, updateUserWallet] = useUserWallet();

  useEffect(() => {
    initCurrentUser();
    // eslint-disable-next-line
  }, [web3Connect]);

  useEffect(() => {
    const noDaoService = !dao || !dao.daoService;
    const notSignedIn = !user || user.type === USER_TYPE.READ_ONLY;
    if (noDaoService || notSignedIn) {
      return;
    }

    initUserWallet();
    // eslint-disable-next-line
  }, [dao, user]);

  const initCurrentUser = async () => {
    // console.log('************initCurrentUser();');
    let loginType = localStorage.getItem('loginType') || USER_TYPE.READ_ONLY;
    if (user && user.type === loginType) {
      return;
    }

    if (web3Connect.w3c.cachedProvider) {
      loginType = USER_TYPE.WEB3;
    }

    let providerConnect;
    try {
      console.log(`Initializing user type: ${loginType || 'read-only'}`);

      switch (loginType) {
        case USER_TYPE.WEB3: {
          if (web3Connect.w3c.cachedProvider) {
            try {
              // providerConnect = await w3connect(_web3);
              providerConnect = await w3connect(web3Connect);
            } catch (err) {
              console.log(err);

              toast({
                title: 'Wrong Network',
                position: 'top-right',
                description: err.msg,
                status: 'warning',
                duration: 9000,
                isClosable: true,
              });
            }

            const { w3c, web3, provider } = providerConnect;
            const [account] = await web3.eth.getAccounts();
            const web3User = createWeb3User(account);
            const profile = await getProfile(web3User.username);

            updateWeb3Connect({ w3c, web3, provider });

            updateUser({ ...web3User, profile });
          }
          break;
        }
        case USER_TYPE.READ_ONLY:
        default:
          break;
      }

      localStorage.setItem('loginType', loginType);
    } catch (e) {
      console.error(
        `Could not log in with loginType ${loginType}: ${e.toString()}`,
      );
      localStorage.setItem('loginType', '');
    }
  };

  const initUserWallet = async () => {
    // console.log('^^^^^^^^^^^^^^initUserWallet');
    // TODO: Do we still need all these - see if we can get elsewhere and store on user entity in state
    const addrByDelegateKey = await dao.daoService.moloch.memberAddressByDelegateKey(
      user.username,
    );
    const tokenBalanceWei = await dao.daoService.token.balanceOf(user.username);
    const allowanceWei = await dao.daoService.token.allowance(
      user.username,
      dao.daoService.daoAddress,
    );
    const tokenBalance = dao.daoService.web3.utils.fromWei(tokenBalanceWei);
    const allowance = dao.daoService.web3.utils.fromWei(allowanceWei);
    const member = await dao.daoService.moloch.members(addrByDelegateKey);
    const shares = parseInt(member.shares) || 0;
    const loot = parseInt(member.loot) || 0;
    const jailed = parseInt(member.jailed) || 0;
    const highestIndexYesVote = member.highestIndexYesVote;
    let eth = 0;
    eth = await dao.daoService.getAccountEth();
    const wallet = {
      tokenBalance,
      allowance,
      eth,
      loot,
      highestIndexYesVote,
      jailed,
      shares,
      addrByDelegateKey,
    };

    updateUserWallet(wallet);
  };

  return <></>;
};

export default UserInit;
