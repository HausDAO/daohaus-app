import React, {
  useEffect,
  useContext,
  createContext,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { bigGraphQuery } from "../utils/theGraph";
import { useSessionStorage } from "../hooks/useSessionStorage";

import { supportedChains } from "../utils/chain";
import { useInjectedProvider } from "./InjectedProviderContext";
import { MetaDataProvider } from "./MetaDataContext";
import { TokenProvider } from "./TokenContext";
import { TXProvider } from "./TXContext";

export const DaoContext = createContext();

export const DaoProvider = ({ children }) => {
  const { daoid, daochain } = useParams();
  const { injectedChain, injectedProvider, address } = useInjectedProvider();

  const daoNetworkData = supportedChains[daochain];
  const isCorrectNetwork = daochain === injectedChain?.chainId;

  const [daoProposals, setDaoProposals] = useSessionStorage(
    `proposals-${daoid}`,
    null
  );
  const [daoActivities, setDaoActivities] = useSessionStorage(
    `activities-${daoid}`,
    null
  );
  const [daoOverview, setDaoOverview] = useSessionStorage(
    `overview-${daoid}`,
    null
  );
  const [daoMembers, setDaoMembers] = useSessionStorage(
    `members-${daoid}`,
    null
  );
  const [daoBalances, setDaoBalances] = useSessionStorage(
    `balances-${daoid}`,
    null
  );
  const [daoTransmutations, setTransmutations] = useSessionStorage(
    `transmutations-${daoid}`,
    null
  );

  const [isMember, setIsMember] = useState(false);

  const hasPerformedBatchQuery = useRef(false);
  const currentMember = useRef(false);

  useEffect(() => {
    //This condition is brittle. If one request passes, but the rest fail
    //this stops the app from fetching. We'll need something better later on.
    if (
      daoProposals ||
      daoActivities ||
      daoOverview ||
      daoMembers ||
      daoBalances ||
      daoTransmutations
    )
      return;
    if (
      !daoid ||
      !daochain ||
      !daoNetworkData ||
      !address ||
      hasPerformedBatchQuery.current
    )
      return;

    bigGraphQuery({
      args: {
        daoID: daoid,
        chainID: daochain,
      },
      getSetters: [
        { getter: "getOverview", setter: setDaoOverview },
        {
          getter: "getActivities",
          setter: { setDaoProposals, setDaoActivities },
        },
        { getter: "getMembers", setter: setDaoMembers },
        { getter: "getTransmutations", setter: setTransmutations },
      ],
    });
    hasPerformedBatchQuery.current = true;
  }, [
    daoid,
    daochain,
    address,
    daoNetworkData,
    daoActivities,
    daoBalances,
    daoMembers,
    daoOverview,
    daoProposals,
    daoTransmutations,
    setDaoActivities,
    setTransmutations,
    setDaoBalances,
    setDaoMembers,
    setDaoOverview,
    setDaoProposals,
    isCorrectNetwork,
  ]);

  useEffect(() => {
    const checkIfMember = (daoMembers) => {
      return daoMembers.some((member) => member.memberAddress === address);
    };
    if (daoMembers && address) {
      if (currentMember.current !== address) {
        setIsMember(checkIfMember(daoMembers));
        currentMember.current = address;
      }
    }
  }, [daoMembers, address]);

  const refetch = () => {
    bigGraphQuery({
      args: {
        daoID: daoid,
        chainID: daochain,
      },
      getSetters: [
        { getter: "getOverview", setter: setDaoOverview },
        {
          getter: "getActivities",
          setter: { setDaoProposals, setDaoActivities },
        },
        { getter: "getMembers", setter: setDaoMembers },
        { getter: "getTransmutations", setter: setTransmutations },
      ],
    });
  };

  return (
    <DaoContext.Provider
      value={{
        daoProposals,
        daoActivities,
        daoBalances,
        daoMembers,
        daoOverview,
        isMember,
        isCorrectNetwork,
        refetch,
        hasPerformedBatchQuery, //Ref, not state
        currentMember, //Ref, not state
      }}
    >
      <MetaDataProvider>
        <TokenProvider>
          <TXProvider>{children}</TXProvider>
        </TokenProvider>
      </MetaDataProvider>
    </DaoContext.Provider>
  );
};

export const useLocalDaoData = () => {
  const {
    daoProposals,
    daoActivities,
    daoBalances,
    daoMembers,
    daoOverview,
    isMember,
    isCorrectNetwork,
    refetch,
    hasPerformedBatchQuery, //Ref, not state
    currentMember, //Ref, not state
  } = useContext(DaoContext);
  return {
    daoProposals,
    daoActivities,
    daoBalances,
    daoMembers,
    daoOverview,
    isMember,
    isCorrectNetwork,
    refetch,
    hasPerformedBatchQuery,
    currentMember,
  };
};
