import React, { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@chakra-ui/core';
import { getProfile } from '3box/lib/api';

import { createWeb3User, w3connect } from '../utils/Auth';
import { USER_TYPE } from '../utils/DaoService';
import { TxProcessorService } from '../utils/TxProcessorService';
import { PokemolContext } from './PokemolContext';

export const LoaderContext = createContext(false);
const StoreInit = ({ children }) => {
  const toast = useToast();
  const { state, dispatch } = useContext(PokemolContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    initCurrentUser();
    // needs more testing to see when/what else needs to trigger initCurrentUser
    // }, [state.web3, state.user]);
    // eslint-disable-next-line
  }, []);

  return (
    <LoaderContext.Provider value={[loading, setLoading]}>
      {children}
    </LoaderContext.Provider>
  );
};

export default StoreInit;
