import React, {
  useContext,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ApolloProvider } from "react-apollo";
import { useInjectedProvider } from "./InjectedProviderContext";

import { createClient } from "../utils/apollo";

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const { injectedChain } = useInjectedProvider();

  //There is a chance that I may not even need to make
  //these clients or keep them in state.
  const [subgraphClient, setSubgraph] = useState(
    createClient(injectedChain, "subgraph_url")
  );
  // const [statsGraphClient, setStatsGraph] = useState(
  //   createClient(injectedChain, "stats_graph_url")
  // );
  // const [boostsGraphClient, setBoostsGraph] = useState(
  //   createClient(injectedChain, "boosts_graph_url")
  // );
  const previousChain = useRef(injectedChain.name);

  useEffect(() => {
    // only rerender if the parent chain has actually changed
    // uses useRef to save some sort of state without
    // causing rerenders or triggering useEffect
    if (injectedChain.name !== previousChain.current) {
      setSubgraph(createClient(injectedChain["subgraph_url"]));
      // setStatsGraph(createClient(injectedChain, "stats_graph_url"));
      // setBoostsGraph(createClient(injectedChain, "boosts_graph_url"));
      previousChain.current = injectedChain.name;
    }
  }, [injectedChain]);

  return (
    <ApolloProvider client={subgraphClient}>
      <GraphContext.Provider value={{ subgraphClient }}>
        {children}
      </GraphContext.Provider>
    </ApolloProvider>
  );
};

export const useGraph = () => {
  const { subgraphClient } = useContext(GraphContext);
  return { subgraphClient };
};
