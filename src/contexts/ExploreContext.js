import React from 'react';
import { useQuery } from 'react-apollo';

import { GET_TOKENS } from '../utils/apollo/explore-queries';
import {
  SORT_OPTIONS,
  EXPLORE_FILTER_OPTIONS,
} from '../content/explore-content';

const ExploreContext = React.createContext();

const initialState = {
  allDaos: [],
  prices: null,
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
    case 'setPrices': {
      return { ...state, prices: action.payload };
    }
    case 'clearPrices': {
      return { ...state, searchTerm: initialState.prices };
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

function ExploreContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  const { loading, error, data, fetchMore } = useQuery(GET_TOKENS, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <></>;
  if (error) return <p className='View'>Sorry there has been an error</p>;

  fetchMore({
    variables: { skip: data.tokens.length },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (fetchMoreResult.tokens.length === 0) {
        return prev;
      }

      return Object.assign({}, prev, {
        tokens: [...prev.tokens, ...fetchMoreResult.tokens],
      });
    },
  });

  return (
    <ExploreContext.Provider value={value}>
      {props.children}
    </ExploreContext.Provider>
  );
}

const ExploreContextConsumer = ExploreContext.Consumer;

export { ExploreContext, ExploreContextProvider, ExploreContextConsumer };
