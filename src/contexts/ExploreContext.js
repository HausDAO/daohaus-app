import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-apollo';

import { GET_TOKENS } from '../utils/apollo/explore-queries';
import {
  SORT_OPTIONS,
  EXPLORE_FILTER_OPTIONS,
} from '../content/explore-content';
// import { getUsd, XDAI_TOKEN_PAIRS } from '../util/prices';

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
    network: EXPLORE_FILTER_OPTIONS.filter((o) => o.type === 'network').map(
      (o) => o.value,
    ),
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
  const [fetchComplete, setFetchComplete] = useState(false);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  const { loading, error, data, fetchMore } = useQuery(GET_TOKENS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // const getAllPrices = async () => {
    //   let uniqueTokens = _.uniq(data.tokens.map((token) => token.tokenAddress));
    //   if (process.env.REACT_APP_NETWORK_ID === '100') {
    //     uniqueTokens = uniqueTokens.map(
    //       (xdaiAddress) => XDAI_TOKEN_PAIRS[xdaiAddress],
    //     );
    //   }
    //   let prices = {};
    //   try {
    //     const res = await getUsd(uniqueTokens.join(','));
    //     prices = res.data;
    //   } catch (err) {
    //     console.log('price api error', err);
    //   }
    //   if (process.env.REACT_APP_NETWORK_ID === '100') {
    //     prices = _.mapKeys(prices, (k, v) => {
    //       const i = Object.values(XDAI_TOKEN_PAIRS).indexOf(v.toLowerCase());
    //       return Object.keys(XDAI_TOKEN_PAIRS)[i];
    //     });
    //   }
    //   dispatch({ type: 'setPrices', payload: prices });
    // };
    // if (fetchComplete) {
    //   getAllPrices();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchComplete]);

  if (loading) return <></>;
  if (error) return <p className='View'>Sorry there has been an error</p>;

  fetchMore({
    variables: { skip: data.tokens.length },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (fetchMoreResult.tokens.length === 0) {
        setFetchComplete(true);
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
