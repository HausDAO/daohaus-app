import React, { createContext, useEffect } from 'react';

import { useSessionStorage } from '../hooks/useSessionStorage';
import { EXPLORER_DAOS } from '../graphQL/explore-queries';
import { exploreChainQuery } from '../utils/theGraph';
import { getApiMetadata } from '../utils/metadata';
import { SORT_OPTIONS, EXPLORE_FILTER_OPTIONS } from '../utils/exploreContent';
import { supportedChains } from '../utils/chain';

export const ExploreContext = createContext();

const initialState = {
  filters: {
    members: ['1'],
    network: EXPLORE_FILTER_OPTIONS.filter(o => o.type === 'network')
      .filter(o => o.default)
      .map(o => o.value),
  },
  searchTerm: null,
  sort: SORT_OPTIONS[0],
  tags: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'resetExplore': {
      return {
        ...state,
        sort: initialState.sort,
        filters: initialState.filters,
        searchTerm: initialState.searchTerm,
      };
    }
    case 'updateSort': {
      return { ...state, sort: action.payload };
    }
    case 'resetSort': {
      return { ...state, sort: initialState.sort };
    }
    case 'addFilter': {
      return { ...state, filters: { ...state.filters, ...action.payload } };
    }
    case 'updateFilter': {
      const updatedFilters = { ...state.filters, ...action.payload };

      return { ...state, filters: updatedFilters };
    }
    case 'setSearchTerm': {
      return { ...state, searchTerm: action.payload };
    }
    case 'clearSearchTerm': {
      return { ...state, searchTerm: initialState.searchTerm };
    }
    case 'updateTags': {
      return { ...state, tags: action.payload };
    }
    case 'clearTags': {
      return { ...state, tags: initialState.tags };
    }

    default: {
      return initialState;
    }
  }
};

export const ExploreContextProvider = ({ children }) => {
  const [exploreDaos, setExploreDaos] = useSessionStorage('exploreDaoData', {
    chains: [],
    data: [],
  });
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const hasLoadedExploreData =
    exploreDaos.chains.length === Object.keys(supportedChains).length;

  useEffect(() => {
    if (!exploreDaos.chains.length) {
      exploreChainQuery({
        query: EXPLORER_DAOS,
        supportedChains,
        endpointType: 'subgraph_url',
        apiFetcher: getApiMetadata,
        reactSetter: setExploreDaos,
      });
    }
  }, [exploreDaos, setExploreDaos]);

  return (
    <ExploreContext.Provider
      value={{
        state,
        dispatch,
        exploreDaos,
        hasLoadedExploreData,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};
