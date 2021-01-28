import React, { createContext, useEffect } from 'react';

import { getApiMetadata } from '../utils/metadata';

import { useSessionStorage } from '../hooks/useSessionStorage';
import { exploreChainQuery } from '../utils/theGraph';
import { supportedChains } from '../utils/chain';
import { EXPLORER_DAOS } from '../graphQL/explore-queries';
import { SORT_OPTIONS, EXPLORE_FILTER_OPTIONS } from '../utils/exploreContent';

export const ExploreContext = createContext();

const initialState = {
  allDaos: [],
  sort: SORT_OPTIONS[0],
  tags: [],
  filters: {
    members: ['1'],
    purpose: EXPLORE_FILTER_OPTIONS.filter((o) => o.type === 'purpose').map(
      (o) => o.value,
    ),
    version: EXPLORE_FILTER_OPTIONS.filter((o) => o.type === 'version').map(
      (o) => o.value,
    ),
    network: EXPLORE_FILTER_OPTIONS.filter((o) => o.type === 'network')
      .map((o) => o.value)
      .filter((o) => o === '1' || o === '100'),
  },
  searchTerm: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setAllDaos': {
      return { ...state, allDaos: action.payload };
    }
    case 'resetExplore': {
      return {
        ...state,
        allDaos: initialState.allDaos,
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
  const [exploreDaos, setExploreDaos] = useSessionStorage('exploreDaoData', []);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const hasLoadedExploreData = exploreDaos.length === 4;

  useEffect(() => {
    if (!exploreDaos.length) {
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
      value={{ state, dispatch, exploreDaos, hasLoadedExploreData }}
    >
      {children}
    </ExploreContext.Provider>
  );
};
