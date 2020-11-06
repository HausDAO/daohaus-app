import React, { useEffect } from 'react';
import { useToast } from '@chakra-ui/core';
import { getProfile } from '3box/lib/api';

import { createWeb3User, w3connect } from '../utils/auth';
import { USER_TYPE } from '../utils/dao-service';
import { useUser, useWeb3Connect } from './PokemolContext';

const UserInit = () => {
  const toast = useToast();
  const [web3Connect, updateWeb3Connect] = useWeb3Connect();
  const [user, updateUser] = useUser();

  useEffect(() => {
    initCurrentUser();
    // eslint-disable-next-line
  }, [web3Connect]);

  const initCurrentUser = async () => {
    console.log('@@@@@@@@@@@ INIT USER');
    let loginType = localStorage.getItem('loginType') || USER_TYPE.READ_ONLY;
    if (user && user.type === loginType) {
      console.log('early');
      return;
    }

    if (web3Connect.w3c.cachedProvider) {
      loginType = USER_TYPE.WEB3;
    }

    let providerConnect;
    try {
      switch (loginType) {
        case USER_TYPE.WEB3: {
          if (web3Connect.w3c.cachedProvider) {
            try {
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

            updateUser({ ...user, ...web3User, profile });

            updateWeb3Connect({ w3c, web3, provider });
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

  return <></>;
};

export default UserInit;
