import React, {
  useEffect,
  useContext,
  createContext,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { DaoMemberProvider } from './DaoMemberContext';
import { MetaDataProvider } from './MetaDataContext';
import { TokenProvider } from './TokenContext';
import { TXProvider } from './TXContext';
import { useUser } from './UserContext';
import { useInjectedProvider } from './InjectedProviderContext';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { bigGraphQuery } from '../utils/theGraph';
import { supportedChains } from '../utils/chain';
import { putRefreshApiVault } from '../utils/metadata';
import { UBERHAUS_DATA } from '../utils/uberhaus';

export const DaoContext = createContext();

export const DaoProvider = ({ children }) => {
  const { daoid, daochain } = useParams();
  const { apiData } = useUser();
  const { injectedChain, address } = useInjectedProvider();

  const daoNetworkData = supportedChains[daochain];
  const isCorrectNetwork = daochain === injectedChain?.chainId;

  const [daoProposals, setDaoProposals] = useSessionStorage(
    `proposals-${daoid}`,
    null,
  );
  const [daoActivities, setDaoActivities] = useSessionStorage(
    `activities-${daoid}`,
    null,
  );
  const [daoOverview, setDaoOverview] = useSessionStorage(
    `overview-${daoid}`,
    null,
  );
  const [daoMembers, setDaoMembers] = useSessionStorage(
    `members-${daoid}`,
    null,
  );

  const [uberMinionData, setUberMinionData] = useState(null);
  const [isUberHaus, setIsUberHaus] = useState(false);

  const [daoVaults, setDaoVaults] = useSessionStorage(`vaults-${daoid}`, null);

  const hasPerformedBatchQuery = useRef(false);
  const currentDao = useRef(null);

  useEffect(() => {
    // This condition is brittle. If one request passes, but the rest fail
    // this stops the app from fetching. We'll need something better later on.
    if (
      daoProposals ||
      daoActivities ||
      daoOverview ||
      daoMembers ||
      uberMinionData
    ) {
      return;
    }
    if (
      !daoid ||
      !daochain ||
      !daoNetworkData ||
      hasPerformedBatchQuery.current
    ) {
      return;
    }

    const bigQueryOptions = {
      args: {
        daoID: daoid.toLowerCase(),
        chainID: daochain,
      },
      getSetters: [
        { getter: 'getOverview', setter: { setDaoOverview, setDaoVaults } },
        {
          getter: 'getActivities',
          setter: { setDaoProposals, setDaoActivities },
        },
        { getter: 'getMembers', setter: setDaoMembers },
        { getter: 'uberMinionData', setter: setUberMinionData },
      ],
    };

    bigGraphQuery(bigQueryOptions);
    hasPerformedBatchQuery.current = true;
  }, [
    daoid,
    daochain,
    daoNetworkData,
    daoActivities,
    daoMembers,
    daoOverview,
    daoProposals,
    daoVaults,
    setDaoActivities,
    setDaoMembers,
    setDaoOverview,
    setDaoProposals,
    setDaoVaults,
    isCorrectNetwork,
    uberMinionData,
  ]);

  const refetch = () => {
    const bigQueryOptions = {
      args: {
        daoID: daoid.toLowerCase(),
        chainID: daochain,
      },
      getSetters: [
        { getter: 'getOverview', setter: { setDaoOverview, setDaoVaults } },
        {
          getter: 'getActivities',
          setter: { setDaoProposals, setDaoActivities },
        },
        { getter: 'getMembers', setter: setDaoMembers },
        { getter: 'uberMinionData', setter: setUberMinionData },
      ],
    };
    currentDao.current = null;
    bigGraphQuery(bigQueryOptions);
  };

  const refreshAllDaoVaults = async () => {
    const { network } = supportedChains[daochain];
    await putRefreshApiVault({ network, molochAddress: daoid });
  };

  useEffect(() => {
    if (apiData && daoMembers && uberMinionData) {
      if (currentDao.current === daoid) return;
      const membersWithUberData = daoMembers.map(member => {
        const minionMember = uberMinionData.find(
          minion => minion.minionAddress === member.memberAddress,
        );
        if (minionMember) {
          return {
            ...member,
            uberMinion: minionMember,
            uberMeta: apiData[minionMember.molochAddress][0],
            isUberMinion: true,
          };
        }
        return member;
      });
      setIsUberHaus(true);
      currentDao.current = daoid;
      setDaoMembers(membersWithUberData);
    } else if (apiData && daoMembers && daoid !== UBERHAUS_DATA.ADDRESS) {
      currentDao.current = daoid;
      setIsUberHaus(false);
    }
  }, [daoMembers, daoid, apiData, uberMinionData]);

  return (
    <DaoContext.Provider
      value={{
        daoProposals,
        isUberHaus,
        daoActivities,
        daoMembers,
        daoOverview,
        daoVaults,
        setIsUberHaus,
        isCorrectNetwork,
        refetch,
        refreshAllDaoVaults,
        hasPerformedBatchQuery, // Ref, not state
      }}
    >
      <MetaDataProvider>
        <TokenProvider>
          <DaoMemberProvider
            daoMembers={daoMembers}
            address={address}
            overview={daoOverview}
          >
            <TXProvider>{children}</TXProvider>
          </DaoMemberProvider>
        </TokenProvider>
      </MetaDataProvider>
    </DaoContext.Provider>
  );
};
export const useDao = () => {
  const {
    daoProposals,
    daoActivities,
    daoMembers,
    setIsUberHaus,
    daoOverview,
    daoVaults,
    isUberHaus,
    isCorrectNetwork,
    refetch,
    refreshAllDaoVaults,
    hasPerformedBatchQuery, // Ref, not state
  } = useContext(DaoContext);
  return {
    daoProposals,
    daoActivities,
    isUberHaus,
    setIsUberHaus,
    daoMembers,
    daoOverview,
    daoVaults,
    isCorrectNetwork,
    refetch,
    refreshAllDaoVaults,
    hasPerformedBatchQuery,
  };
};
