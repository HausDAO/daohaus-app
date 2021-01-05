import React, { useEffect, useContext, createContext } from "react";
import { useParams } from "react-router-dom";
import { BANK_BALANCES } from "../graphQL/bank-queries";
import { DAO_ACTIVITIES, HOME_DAO } from "../graphQL/dao-queries";
import { MEMBERS_LIST } from "../graphQL/member-queries";
import { PROPOSALS_LIST } from "../graphQL/proposal-queries";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { multiFetch } from "../utils/apollo";
import { useInjectedProvider } from "./InjectedProviderContext";

export const DaoContext = createContext();

export const DaoProvider = ({ children }) => {
  const { id } = useParams();
  const { injectedChain } = useInjectedProvider();
  const [daoProposals, setDaoProposals] = useSessionStorage(
    "daoProposals",
    null
  );
  const [daoActivities, setDaoActivities] = useSessionStorage(
    "daoActivites",
    null
  );
  const [daoOverview, setDaoOverview] = useSessionStorage("daoOverview", null);
  const [daoMembers, setDaoMembers] = useSessionStorage("daoMembers", null);
  const [daoBalances, setDaoBalances] = useSessionStorage("daoBalances", null);

  useEffect(() => {
    if (
      daoProposals ||
      daoActivities ||
      daoOverview ||
      daoMembers ||
      daoBalances
    )
      return;
    if (!id || !injectedChain) return;

    multiFetch([
      {
        endpoint: injectedChain.subgraph_url,
        query: PROPOSALS_LIST,
        variables: {
          contractAddr: id,
          skip: 0,
        },
        reactSetter: setDaoProposals,
      },
      {
        endpoint: injectedChain.subgraph_url,
        query: HOME_DAO,
        variables: {
          contractAddr: id,
        },
        reactSetter: setDaoOverview,
      },
      {
        endpoint: injectedChain.subgraph_url,
        query: MEMBERS_LIST,
        variables: {
          contractAddr: id,
          skip: 0,
        },
        reactSetter: setDaoMembers,
      },

      {
        endpoint: injectedChain.subgraph_url,
        query: DAO_ACTIVITIES,
        variables: {
          contractAddr: id,
          skip: 0,
        },
        reactSetter: setDaoActivities,
      },
      {
        endpoint: injectedChain.stats_graph_url,
        query: BANK_BALANCES,
        variables: {
          molochAddress: id,
          skip: 0,
        },
        reactSetter: setDaoBalances,
      },
    ]);
  }, [
    id,
    injectedChain,
    daoActivities,
    daoBalances,
    daoMembers,
    daoOverview,
    daoProposals,
    setDaoActivities,
    setDaoBalances,
    setDaoMembers,
    setDaoOverview,
    setDaoProposals,
  ]);

  return (
    <DaoContext.Provider
      value={{
        daoProposals,
        daoActivities,
        daoBalances,
        daoMembers,
        daoOverview,
      }}
    >
      {children}
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
  } = useContext(DaoContext);
  return { daoProposals, daoActivities, daoBalances, daoMembers, daoOverview };
};
