import { graphQuery } from '../utils/apollo';
import { PROPOSALS_LIST } from '../graphQL/proposal-queries';
import {
  DAO_POLL,
  MINION_POLL,
  HOME_DAO,
  RAGE_QUIT_POLL,
  MINION_PROPOSAL_POLL,
} from '../graphQL/dao-queries';
import {
  RAGE_KICK_POLL,
  MEMBERS_LIST,
  MEMBER_DELEGATE_KEY,
} from '../graphQL/member-queries';
import { GET_WRAP_N_ZAPS } from '../graphQL/boost-queries';
import { getGraphEndpoint } from '../utils/chain';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { TokenService } from '../services/tokenService';

import { UBERHAUS_MEMBER_DELEGATE } from '../graphQL/uberhaus-queries';
import { MinionService } from '../services/minionService';
import { SuperfluidMinionService } from '../services/superfluidMinionService';
import { UberHausMinionService } from '../services/uberHausMinionService';

export const pollProposals = async ({ daoID, chainID }) =>
  graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: PROPOSALS_LIST,
    variables: {
      contractAddr: daoID,
      skip: 0,
    },
  });

export const pollTokenAllowances = async ({
  chainID,
  daoID,
  tokenAddress,
  userAddress,
}) => {
  const tokenContract = TokenService({
    chainID,
    tokenAddress,
  });

  const amountApproved = await tokenContract('allowance')({
    accountAddr: userAddress,
    contractAddr: daoID,
  });
  return amountApproved;
};

export const pollMolochSummon = async ({ chainID, summoner, createdAt }) => {
  return graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: DAO_POLL,
    variables: {
      summoner,
      createdAt,
    },
  });
};

export const pollMinionSummon = async ({
  chainID,
  molochAddress,
  createdAt,
}) => {
  return graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: MINION_POLL,
    variables: {
      molochAddress,
      createdAt,
    },
  });
};

export const pollMinionProposal = async ({
  chainID,
  minionAddress,
  createdAt,
}) => {
  return graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: MINION_PROPOSAL_POLL,
    variables: {
      minionAddress,
      createdAt,
    },
  });
};

export const pollMinionExecute = async ({
  chainID,
  minionAddress,
  proposalId,
  proposalType,
}) => {
  try {
    if (proposalType === PROPOSAL_TYPES.MINION_VANILLA) {
      const action = await MinionService({
        minion: minionAddress,
        chainID,
      })('getAction')({ proposalId });
      return action.executed;
    }
    if (proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID) {
      const action = await SuperfluidMinionService({
        minion: minionAddress,
        chainID,
      })('getStream')({ proposalId });
      return action.executed;
    }
    if (
      proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE ||
      proposalType === PROPOSAL_TYPES.MINION_UBER_RQ
    ) {
      const action = await UberHausMinionService({
        uberHausMinion: minionAddress,
        chainID,
      })('getAction')({ proposalId });
      return action.executed;
    }
    if (proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
      console.log('POLLS UBER DEL');
      const action = await UberHausMinionService({
        uberHausMinion: minionAddress,
        chainID,
      })('getAppointment')({ proposalId });
      return action.executed;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('Error caught in Poll block of TX');
  }
};

export const pollMinionCancel = async ({
  chainID,
  minionAddress,
  proposalId,
  proposalType,
}) => {
  try {
    if (proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID) {
      const action = await SuperfluidMinionService({
        minion: minionAddress,
        chainID,
      })('getStream')({ proposalId });
      return !action.active;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error caught in Poll block of TX');
  }
};

export const pollRageQuit = async ({ chainID, molochAddress, createdAt }) => {
  return graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: RAGE_QUIT_POLL,
    variables: {
      molochAddress,
      createdAt,
    },
  });
};

export const syncTokenPoll = async ({ chainID, daoID, tokenAddress }) => {
  try {
    const daoOverview = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: HOME_DAO,
      variables: {
        contractAddr: daoID,
      },
    });
    const graphBalance = daoOverview?.moloch?.tokenBalances?.find(
      tokenObj => tokenObj?.token?.tokenAddress === tokenAddress,
    )?.tokenBalance;
    return graphBalance;
  } catch (error) {
    return error;
  }
};

export const withdrawTokenFetch = async ({
  chainID,
  daoID,
  memberAddress,
  tokenAddress,
}) => {
  try {
    const data = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: MEMBERS_LIST,
      variables: {
        contractAddr: daoID,
      },
    });
    const member = data.daoMembers?.find(
      member => member?.memberAddress?.toLowerCase() === memberAddress,
    );
    const newTokenBalance = member.tokenBalances.find(
      tokenObj => tokenObj.token.tokenAddress === tokenAddress,
    ).tokenBalance;
    return newTokenBalance;
  } catch (error) {
    return error;
  }
};

export const updateDelegateFetch = async ({
  daoID,
  chainID,
  memberAddress,
}) => {
  try {
    const res = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: MEMBER_DELEGATE_KEY,
      variables: {
        contractAddr: daoID,
        memberAddr: memberAddress,
      },
    });
    return res.members[0];
  } catch (error) {
    return error;
  }
};

export const pollUberHausDelegateSet = async ({
  uberHausAddress,
  minionAddress,
  chainID,
}) => {
  try {
    const res = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: UBERHAUS_MEMBER_DELEGATE,
      variables: {
        molochAddress: uberHausAddress,
        memberAddress: minionAddress,
      },
    });
    return res.members[0];
  } catch (error) {
    return error;
  }
};

export const pollGuildFunds = async ({
  chainID,
  uberMinionAddress,
  tokenAddress,
}) => {
  try {
    const newTokenBalance = TokenService({
      chainID,
      tokenAddress,
    })('balanceOf')(uberMinionAddress);
    return newTokenBalance;
  } catch (error) {
    return error;
  }
};

export const pollDelegateRewards = async ({
  uberMinionAddress,
  chainID,
  delegateAddress,
}) => {
  try {
    const delegate = await UberHausMinionService({
      uberMinionAddress,
      chainID,
    })('delegateByAddress')(delegateAddress);
    return delegate;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const pollRageKick = async ({ chainID, daoID, memberAddress }) => {
  try {
    const res = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
      query: RAGE_KICK_POLL,
      variables: {
        contractAddr: daoID,
        memberAddr: memberAddress,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const pollWrapNZapSummon = async ({ chainID, daoID }) => {
  try {
    const res = await graphQuery({
      endpoint: getGraphEndpoint(chainID, 'boosts_graph_url'),
      query: GET_WRAP_N_ZAPS,
      variables: {
        contractAddress: daoID,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};
