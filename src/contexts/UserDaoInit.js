import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

import {
  useContracts,
  useDao,
  useDaoMetadata,
  useMemberWallet,
  useNetwork,
  useUser,
  useWeb3Connect,
} from './PokemolContext';
import { useTheme } from './CustomThemeContext';
import { DaoService, USER_TYPE } from '../utils/dao-service';
import { createWeb3User, w3connect } from '../utils/auth';
import { getChainDataByName } from '../utils/chains';
import { validDaoParams } from '../utils/helpers';
import { getProfile } from '3box';
import { get } from '../utils/requests';
import { defaultTheme } from '../themes/theme-defaults';

const UserDaoInit = () => {
  const location = useLocation();
  const toast = useToast();
  const [web3Connect, updateWeb3Connect] = useWeb3Connect();
  const [user, updateUser] = useUser();
  const [network, updateNetwork] = useNetwork();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();
  const [contracts, updateContracts] = useContracts();
  const [memberWallet, updateMemberWallet] = useMemberWallet();
  const [, setTheme] = useTheme();
  const [, clearDaoData] = useDao();

  // init the user/web3connect on app load/connect button
  useEffect(() => {
    initUser(network, web3Connect.forceUserInit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Connect]);

  // deal with back button from dao to hub
  useEffect(() => {
    if (location.pathname === '/') {
      clearDaoData({
        ...web3Connect,
        forceUserInit:
          !user ||
          web3Connect.w3c.providerController.network !==
            user.providerNetwork.network,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // init the dao when we're on a dao route
  useEffect(() => {
    const validDaoParam = validDaoParams(location);

    if (!validDaoParam) {
      return;
    }

    if (!daoMetadata || daoMetadata.address !== validDaoParam) {
      initDao(validDaoParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // if we have a dao and a user init the user wallet with data specific to that dao
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

  // if we have a dao and a user re-init the dao contract service with the users web3connect provider
  useEffect(() => {
    const hasUserAndDao = user && daoMetadata;
    const hasReadOnlyService =
      contracts.daoService && !contracts.daoService.accountAddr;
    const userDaoNetworkMatch =
      user && user.providerNetwork.network === network.network;

    if (
      hasUserAndDao &&
      hasReadOnlyService &&
      web3Connect.provider &&
      userDaoNetworkMatch
    ) {
      initWeb3DaoService();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, daoMetadata, contracts, web3Connect, network]);

  const initUser = async (currentNetwork, daoLoaded) => {
    const validDaoParam = validDaoParams(location);
    if (validDaoParam && !daoLoaded) {
      return;
    }

    let loginType = localStorage.getItem('loginType') || USER_TYPE.READ_ONLY;
    if (user && user.type === loginType && !daoLoaded) {
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
              providerConnect = await w3connect(web3Connect, currentNetwork);
            } catch (err) {
              console.log(err);

              toast({
                title: 'Web3 Network Connection Issue',
                position: 'top-right',
                description: err.msg,
                status: 'warning',
                duration: 9000,
                isClosable: true,
              });

              updateUser(null);
            }

            const providerNetwork = getChainDataByName(
              providerConnect.w3c.providerController.network,
            );

            const { w3c, web3, provider } = providerConnect;
            const [account] = await web3.eth.getAccounts();
            const web3User = createWeb3User(account);
            const profile = await getProfile(web3User.username);

            if (!validDaoParam) {
              updateNetwork(providerNetwork);
            }

            updateUser({ ...web3User, profile, providerNetwork });
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

  const initDao = async (daoParam) => {
    let daoRes;
    try {
      daoRes = await get(`dao/${daoParam}`);
    } catch (err) {
      console.log('api fetch error', daoParam);
    }
    const apiData = daoRes.error ? {} : daoRes;
    const daoNetwork = getChainDataByName(apiData.network);
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

    const version = 2;

    const daoService = await DaoService.instantiateWithReadOnly(
      daoParam,
      version,
      daoNetwork,
    );

    if (boosts.customTheme?.active) {
      const themeUpdate = { ...defaultTheme, ...boosts.customTheme.metadata };
      setTheme(themeUpdate);
    } else {
      setTheme(defaultTheme);
    }
    updateDaoMetadata({
      address: daoParam,
      version,
      ...apiData,
      boosts,
    });
    updateContracts({ daoService });

    initUser(daoNetwork, true);
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

    const wallet = {
      daoAddress: contracts.daoService.daoAddress,
      activeMember: member.exists && +member.jailed === 0,
      memberAddress: user.username,
      tokenBalance,
      allowance,
      shares,
    };

    updateMemberWallet(wallet);
  };

  return <></>;
};

export default UserDaoInit;
