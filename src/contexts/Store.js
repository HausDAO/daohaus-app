import React, { useState, useEffect, createContext } from 'react';
import Web3Modal from 'web3modal';

// import { useInterval } from '../utils/PollingUtil';
import { createWeb3User, w3connect, providerOptions } from '../utils/Auth';
import { DaoService, USER_TYPE } from '../utils/DaoService';
import { getChainData } from '../utils/chains';
import { get } from '../utils/Requests';

export const CurrentUserContext = createContext();
export const CurrentWalletContext = createContext();
export const LoaderContext = createContext(false);
export const ModalContext = createContext();
export const DaoDataContext = createContext();
export const DaoServiceContext = createContext();
export const Web3ConnectContext = createContext();
export const BoostContext = createContext();

// main store of global state
const Store = ({ children, daoParam }) => {
  // store of aws auth information and sdk
  const [currentUser, setCurrentUser] = useState();
  // stores user wallet balances and shares
  const [currentWallet, setCurrentWallet] = useState({
    eth: 0,
    tokenBalance: 0,
    allowance: 0,
    shares: 0,
    devices: null,
    addrByBelegateKey: null,
  });

  // modal state for open once
  const [hasOpened, setHasOpened] = useState({});
  const [loading, setLoading] = useState(false);
  const [daoService, setDaoService] = useState();
  const [daoData, setDaoData] = useState();
  const [boosts, setBoosts] = useState();

  const [web3Connect, setWeb3Connect] = useState({
    w3c: new Web3Modal({
      network: getChainData(+process.env.REACT_APP_NETWORK_ID).network, // optional
      providerOptions, // required
      cacheProvider: true,
    }),
  });

  useEffect(() => {
    // runs on app load, sets up user auth and sdk if necessary
    const initCurrentUser = async () => {
      let loginType = localStorage.getItem('loginType') || USER_TYPE.READ_ONLY;
      // do nothing if user is set correctly
      if (currentUser && currentUser.type === loginType) {
        return;
      }

      let apiData = null;
      let version = null;

      try {
        const daoRes = await get(`moloch/${daoParam}`);
        apiData = daoRes.data;
        version = apiData.version || '1';
      } catch (err) {
        console.log('api fetch error');
      }

      if (!daoParam || !apiData) {
        return;
      }
      if (web3Connect.w3c.cachedProvider) {
        loginType = USER_TYPE.WEB3;
      }

      let user;
      let dao;
      try {
        console.log(`Initializing user type: ${loginType || 'read-only'}`);

        switch (loginType) {
          case USER_TYPE.WEB3: {
            if (web3Connect.w3c.cachedProvider) {
              const { w3c, web3, provider } = await w3connect(web3Connect);
              const [account] = await web3.eth.getAccounts();

              setWeb3Connect({ w3c, web3, provider });

              user = createWeb3User(account);
              dao = await DaoService.instantiateWithWeb3(
                user.username,
                provider,
                daoParam,
                version,
              );
              dao.daoAddress = daoParam;
            } else {
              dao = await DaoService.instantiateWithReadOnly(daoParam, version);
            }
            break;
          }
          case USER_TYPE.READ_ONLY:
          default:
            dao = await DaoService.instantiateWithReadOnly(daoParam, version);
            break;
        }
        setCurrentUser(user);
        localStorage.setItem('loginType', loginType);
      } catch (e) {
        console.error(
          `Could not log in with loginType ${loginType}: ${e.toString()}`,
        );

        localStorage.setItem('loginType', '');

        dao = await DaoService.instantiateWithReadOnly(daoParam, version);
      } finally {
        setDaoService(dao);
      }
    };

    initCurrentUser();
  }, [currentUser, setDaoService, daoParam, web3Connect]);

  useEffect(() => {
    const fetchBoosts = async () => {
      const boostRes = await get(`boosts/${daoParam}`);

      setBoosts(
        boostRes.data.reduce((boosts, boostData) => {
          const metadata = boostData.boostMetadata
            ? JSON.parse(boostData.boostMetadata)
            : null;
          boosts[boostData.boostKey] = {
            active: boostData.active,
            metadata,
          };
          return boosts;
        }, {}),
      );
    };

    if (daoParam) {
      fetchBoosts();
    }
  }, [daoParam]);

  // global polling service
  useEffect(() => {
    if (!daoService) {
      console.log(`DaoService not initialized yet`);
      return;
    }

    if (!currentUser || currentUser.type === USER_TYPE.READ_ONLY) {
      // early return
      return;
    }

    const userSetup = async () => {
      const accountDevices = null;
      // get account address from aws
      const acctAddr = currentUser.username;
      // get delegate key from contract to see if it is different
      const addrByDelegateKey = await daoService.mcDao.memberAddressByDelegateKey(
        acctAddr,
      );

      // get weth balance and allowance of contract
      const tokenBalanceWei = await daoService.token.balanceOf(acctAddr);
      const allowanceWei = await daoService.token.allowance(
        acctAddr,
        daoService.daoAddress,
      );
      // convert from wei to eth
      const tokenBalance = daoService.web3.utils.fromWei(tokenBalanceWei);
      const allowance = daoService.web3.utils.fromWei(allowanceWei);

      // get member shares of dao contract
      const member = await daoService.mcDao.members(addrByDelegateKey);
      // shares will be 0 if not a member, could also be 0 if rage quit
      const shares = parseInt(member.shares);
      const loot = parseInt(member.loot);
      const jailed = parseInt(member.jailed);
      const highestIndexYesVote = member.highestIndexYesVote;

      let eth = 0;
      eth = await daoService.getAccountEth();
      setLoading(false);

      // set state
      setCurrentWallet({
        ...currentWallet,
        ...{
          tokenBalance,
          allowance,
          eth,
          loot,
          highestIndexYesVote,
          jailed,
          shares,
          accountDevices,
          addrByDelegateKey,
        },
      });
    };
    userSetup();
    // eslint-disable-next-line
  }, [currentUser, daoService]);

  return (
    <LoaderContext.Provider value={[loading, setLoading]}>
      <DaoDataContext.Provider value={[daoData, setDaoData]}>
        <ModalContext.Provider value={[hasOpened, setHasOpened]}>
          <Web3ConnectContext.Provider value={[web3Connect, setWeb3Connect]}>
            <DaoServiceContext.Provider value={[daoService, setDaoService]}>
              <BoostContext.Provider value={[boosts, setBoosts]}>
                <CurrentUserContext.Provider
                  value={[currentUser, setCurrentUser]}
                >
                  <CurrentWalletContext.Provider
                    value={[currentWallet, setCurrentWallet]}
                  >
                    {children}
                  </CurrentWalletContext.Provider>
                </CurrentUserContext.Provider>
              </BoostContext.Provider>
            </DaoServiceContext.Provider>
          </Web3ConnectContext.Provider>
        </ModalContext.Provider>
      </DaoDataContext.Provider>
    </LoaderContext.Provider>
  );
};

export default Store;
