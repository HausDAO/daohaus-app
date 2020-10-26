import React, { useEffect, useContext } from 'react';
import { useToast } from '@chakra-ui/core';
import { getProfile } from '3box/lib/api';

import { createWeb3User, w3connect } from '../utils/Auth';
import { USER_TYPE } from '../utils/DaoService';
import { TxProcessorService } from '../utils/TxProcessorService';
import { PokemolContext } from './PokemolContext';

const UserInit = () => {
  const toast = useToast();
  const { state, dispatch } = useContext(PokemolContext);

  useEffect(() => {
    initCurrentUser();
    // TODO: needs more testing to see when/what else needs to trigger initCurrentUser
    // }, [state.web3, state.user]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const noDaoService = !state.dao || !state.dao.daoService;
    const notSignedIn = !state.user || state.user.type === USER_TYPE.READ_ONLY;
    if (noDaoService || notSignedIn) {
      return;
    }

    userSetup();
  }, [state.dao, state.user]);

  const initCurrentUser = async () => {
    let loginType = localStorage.getItem('loginType') || USER_TYPE.READ_ONLY;
    if (state.user && state.user.type === loginType) {
      return;
    }

    if (state.web3.w3c.cachedProvider) {
      loginType = USER_TYPE.WEB3;
    }

    let user;
    let txProcessor;
    let providerConnect;
    try {
      console.log(`Initializing user type: ${loginType || 'read-only'}`);

      switch (loginType) {
        case USER_TYPE.WEB3: {
          if (state.web3.w3c.cachedProvider) {
            try {
              providerConnect = await w3connect(state.web3);
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

            // error here - is it expected?
            const { w3c, web3, provider } = providerConnect;
            const [account] = await web3.eth.getAccounts();

            dispatch({
              type: 'setWeb3',
              payload: { w3c, web3, provider },
            });

            user = createWeb3User(account);

            // TODO: do we want this in it's own INIT?
            txProcessor = new TxProcessorService(web3);
            txProcessor.update(user.username);
            txProcessor.forceUpdate =
              txProcessor.getTxPendingList(user.username).length > 0;

            const profile = await getProfile(user.username);
            dispatch({ type: 'setUser', payload: { ...user, ...profile } });

            dispatch({ type: 'setTxProcessor', paylod: txProcessor });

            web3.eth.subscribe('newBlockHeaders', async (error, result) => {
              if (!error) {
                if (txProcessor.forceUpdate) {
                  await txProcessor.update(user.username);

                  if (!txProcessor.getTxPendingList(user.username).length) {
                    txProcessor.forceUpdate = false;
                  }

                  dispatch({ type: 'setTxProcessor', paylod: txProcessor });
                }
              }
            });
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

  const userSetup = async () => {
    const addrByDelegateKey = await state.dao.daoService.mcDao.memberAddressByDelegateKey(
      state.user.username,
    );
    const tokenBalanceWei = await state.dao.daoService.token.balanceOf(
      state.user.username,
    );
    const allowanceWei = await state.dao.daoService.token.allowance(
      state.user.username,
      state.dao.daoService.daoAddress,
    );
    const tokenBalance = state.dao.daoService.web3.utils.fromWei(
      tokenBalanceWei,
    );
    const allowance = state.dao.daoService.web3.utils.fromWei(allowanceWei);
    const member = await state.dao.daoService.mcDao.members(addrByDelegateKey);
    const shares = parseInt(member.shares);
    const loot = parseInt(member.loot);
    const jailed = parseInt(member.jailed);
    const highestIndexYesVote = member.highestIndexYesVote;
    let eth = 0;
    eth = await state.dao.daoService.getAccountEth();
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
    console.log('setting wallet', wallet);

    // TODO: Do we still need all these - see if we can get elsewhere and store on user entity in state
    dispatch({ type: 'setUserWallet', payload: wallet });
  };

  return <></>;
};

export default UserInit;
