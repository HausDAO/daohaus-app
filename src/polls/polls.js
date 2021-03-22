import { graphQuery } from '../utils/apollo';
import { PROPOSALS_LIST } from '../graphQL/proposal-queries';
import {
  DAO_POLL,
  MINION_POLL,
  HOME_DAO,
  RAGE_QUIT_POLL,
  MINION_PROPOSAL_POLL,
} from '../graphQL/dao-queries';
import { getGraphEndpoint } from '../utils/chain';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { TokenService } from '../services/tokenService';
import { MEMBERS_LIST, MEMBER_DELEGATE_KEY } from '../graphQL/member-queries';
import { UBERHAUS_MEMBER_DELEGATE } from '../graphQL/uberhaus-queries';
import { MinionService } from '../services/minionService';
import { UberHausMinionService } from '../services/uberHausMinionService';

export const pollProposals = async ({ daoID, chainID }) =>
  await graphQuery({
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
  return await graphQuery({
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
  return await graphQuery({
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
  return await graphQuery({
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
    } else if (proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE) {
      const action = await UberHausMinionService({
        minion: minionAddress,
        chainID,
      })('getAction')({ proposalId });
      return action.executed;
    } else if (proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
      const action = await UberHausMinionService({
        minion: minionAddress,
        chainID,
      })('getAppointment')({ proposalId });
      return action.executed;
    }
  } catch (error) {
    console.error('Error caught in Poll block of TX:', error);
  }
};

export const pollRageQuit = async ({ chainID, molochAddress, createdAt }) => {
  return await graphQuery({
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
      (tokenObj) => tokenObj?.token?.tokenAddress === tokenAddress,
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
      (member) => member?.memberAddress?.toLowerCase() === memberAddress,
    );
    const newTokenBalance = member.tokenBalances.find(
      (tokenObj) => tokenObj.token.tokenAddress === tokenAddress,
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
  minionAddress,
  chainID,
  delegateAddress,
}) => {
  try {
    const delegate = await UberHausMinionService({
      uberHausMinion: minionAddress,
      chainID,
    })('delegateByAddress')({ args: [delegateAddress] });
    return delegate;
  } catch (error) {
    console.error(error);
  }
};
