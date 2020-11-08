import React, { useContext, useCallback, useMemo } from 'react';
import Web3Modal from 'web3modal';

import { providerOptions } from '../utils/auth';
import supportedChains, { getChainData } from '../utils/chains';

const PokemolContext = React.createContext();

function usePokemolContext() {
  return useContext(PokemolContext);
}

const initialState = {
  network: supportedChains[42],
  refetchQuery: null,

  user: null,
  web3Connect: {
    w3c: new Web3Modal({
      network: getChainData(+process.env.REACT_APP_NETWORK_ID).network,
      providerOptions,
      cacheProvider: true,
    }),
  },
  contracts: {},
  txProcessor: {},
  ens: {},
  memberWallet: null,
  daoMetadata: null,
  daoGraphData: null,
  userDaos: [],
  proposals: [],
  members: [],
  prices: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setNetwork': {
      return { ...state, network: action.payload };
    }
    case 'refetchQuery': {
      return { ...state, refetchQuery: action.payload };
    }

    case 'setUser': {
      return { ...state, user: action.payload };
    }
    case 'setWeb3Connect': {
      return { ...state, web3Connect: action.payload };
    }
    case 'setContracts': {
      return { ...state, contracts: action.payload };
    }
    case 'setTxProcessor': {
      return { ...state, txProcessor: action.payload };
    }
    case 'setEns': {
      return { ...state, ens: action.payload };
    }

    case 'setDaoMetadata': {
      return { ...state, daoMetadata: action.payload };
    }
    case 'setDaoGraphData': {
      return { ...state, daoGraphData: action.payload };
    }

    case 'setMemberWallet': {
      return { ...state, memberWallet: action.payload };
    }
    case 'setUserDaos': {
      return { ...state, userDaos: action.payload };
    }
    case 'setProposals': {
      return { ...state, proposals: action.payload };
    }
    case 'setMembers': {
      return { ...state, members: action.payload };
    }

    case 'prices': {
      return { ...state, prices: action.payload };
    }
    default: {
      return initialState;
    }
  }
};

function PokemolContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const updateNetwork = useCallback((network) => {
    dispatch({ type: 'setNetwork', payload: network });
  }, []);

  const updateRefetchQuery = useCallback((data) => {
    dispatch({ type: 'refetchQuery', payload: data });
  }, []);

  const updateUser = useCallback((user) => {
    dispatch({ type: 'setUser', payload: user });
  }, []);

  const updateWeb3Connect = useCallback((data) => {
    dispatch({ type: 'setWeb3Connect', payload: data });
  }, []);

  const updateContracts = useCallback((data) => {
    dispatch({ type: 'setContracts', payload: data });
  }, []);

  const updateTxProcessor = useCallback((tx) => {
    dispatch({ type: 'setTxProcessor', payload: tx });
  }, []);

  const updateEns = useCallback((_ens) => {
    dispatch({ type: 'setEns', payload: _ens });
  }, []);

  const updateDaoMetadata = useCallback((data) => {
    dispatch({ type: 'setDaoMetadata', payload: data });
  }, []);

  const updateDaoGraphData = useCallback((data) => {
    dispatch({ type: 'setDaoGraphData', payload: data });
  }, []);

  const updateMemberWallet = useCallback((data) => {
    dispatch({ type: 'setMemberWallet', payload: data });
  }, []);

  const updateUserDaos = useCallback((data) => {
    dispatch({ type: 'setUserDaos', payload: data });
  }, []);

  const updateProposals = useCallback((data) => {
    dispatch({ type: 'setProposals', payload: data });
  }, []);

  const updateMembers = useCallback((data) => {
    dispatch({ type: 'setMembers', payload: data });
  }, []);

  const updatePrices = useCallback((data) => {
    dispatch({ type: 'prices', payload: data });
  }, []);

  return (
    <PokemolContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateNetwork,
            updateRefetchQuery,
            updateUser,
            updateWeb3Connect,
            updateContracts,
            updateTxProcessor,
            updateEns,
            updateDaoMetadata,
            updateDaoGraphData,
            updateMemberWallet,
            updateUserDaos,
            updateProposals,
            updateMembers,
            updatePrices,
          },
        ],
        [
          state,
          updateNetwork,
          updateRefetchQuery,
          updateUser,
          updateWeb3Connect,
          updateContracts,
          updateTxProcessor,
          updateEns,
          updateDaoMetadata,
          updateDaoGraphData,
          updateMemberWallet,
          updateUserDaos,
          updateProposals,
          updateMembers,
          updatePrices,
        ],
      )}
    >
      {props.children}
    </PokemolContext.Provider>
  );
}

export function useDao() {
  const [state] = usePokemolContext();
  return [
    {
      ...state.daoMetadata,
      graphData: state.daoGraphData,
      daoService: state.contracts.daoService,
    },
  ];
}

export function useNetwork() {
  const [state, { updateNetwork }] = usePokemolContext();
  return [state.network, updateNetwork];
}

export function useRefetchQuery() {
  const [state, { updateRefetchQuery }] = usePokemolContext();
  return [state.refetchQuery, updateRefetchQuery];
}

export function useUser() {
  const [state, { updateUser }] = usePokemolContext();
  return [state.user, updateUser];
}

export function useWeb3Connect() {
  const [state, { updateWeb3Connect }] = usePokemolContext();
  return [state.web3Connect, updateWeb3Connect];
}

export function useTxProcessor() {
  const [state, { updateTxProcessor }] = usePokemolContext();
  return [state.txProcessor, updateTxProcessor];
}

export function useEns() {
  const [state, { updateEns }] = usePokemolContext();
  return [state.ens, updateEns];
}

export function useContracts() {
  const [state, { updateContracts }] = usePokemolContext();
  return [state.contracts, updateContracts];
}

export function useDaoMetadata() {
  const [state, { updateDaoMetadata }] = usePokemolContext();
  return [state.daoMetadata, updateDaoMetadata];
}

export function useDaoGraphData() {
  const [state, { updateDaoGraphData }] = usePokemolContext();
  return [state.daoGraphData, updateDaoGraphData];
}

export function useMemberWallet() {
  const [state, { updateMemberWallet }] = usePokemolContext();
  return [state.memberWallet, updateMemberWallet];
}

export function useUserDaos() {
  const [state, { updateUserDaos }] = usePokemolContext();
  return [state.userDaos, updateUserDaos];
}

export function useProposals() {
  const [state, { updateProposals }] = usePokemolContext();
  return [state.proposals, updateProposals];
}

export function useMembers() {
  const [state, { updateMembers }] = usePokemolContext();
  return [state.members, updateMembers];
}

export function usePrices() {
  const [state, { updatePrices }] = usePokemolContext();
  return [state.prices, updatePrices];
}

const PokemolContextConsumer = PokemolContext.Consumer;

export { PokemolContext, PokemolContextProvider, PokemolContextConsumer };
