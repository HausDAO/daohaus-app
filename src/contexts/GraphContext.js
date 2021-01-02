import React, {
  useContext,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { useInjectedProvider } from "./InjectedProviderContext";

const createClient = (chainData, subGraph) => {
  return new ApolloClient({ uri: chainData[subGraph] });
};

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const { injectedChain } = useInjectedProvider();

  const [subgraph, setSubgraph] = useState(
    createClient(injectedChain, "subgraph_url")
  );
  const [statsGraph, setStatsGraph] = useState(
    createClient(injectedChain, "stats_graph_url")
  );
  const [boostsGraph, setBoostsGraph] = useState(
    createClient(injectedChain, "boosts_graph_url")
  );
  const previousChain = useRef(injectedChain.name);

  useEffect(() => {
    // only rerender if the parent chain has actually changed
    // uses useRef to save some sort of state without
    // causing rerenders or triggering useEffect
    if (injectedChain.name !== previousChain.current) {
      setSubgraph(createClient(injectedChain, "subgraph_url"));
      setStatsGraph(createClient(injectedChain, "stats_graph_url"));
      setBoostsGraph(createClient(injectedChain, "boosts_graph_url"));
      previousChain.current = injectedChain.name;
    }
  }, [injectedChain]);

  return (
    <ApolloProvider client={subgraph}>
      <GraphContext.Provider value={{ subgraph, statsGraph, boostsGraph }}>
        {children}
      </GraphContext.Provider>
    </ApolloProvider>
  );
};

export const useGraph = () => {
  const { subgraph, statsGraph, boostsGraph } = useContext(GraphContext);
  return { subgraph, statsGraph, boostsGraph };
};
