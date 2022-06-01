import Web3 from 'web3';

import { SuperfluidMinionService } from '../services/superfluidMinionService';
import { NFTService } from '../services/nftService';
import {
  DAO_POLL,
  MINION_POLL,
  MINION_PROPOSAL_POLL,
} from '../graphQL/dao-queries';
import { MEMBERS_LIST } from '../graphQL/member-queries';
import { TX_HASH } from '../graphQL/general';
import { SF_SUPERTOKEN_CREATED } from '../graphQL/superfluid-queries';
import { createContract } from '../utils/contract';
import { getContractABI, LOCAL_ABI } from '../utils/abi';
import { getGraphEndpoint, supportedChains } from '../utils/chain';
import { graphQuery } from '../utils/apollo';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { MINION_ACTION_FUNCTION_NAMES } from '../utils/minionUtils';
import { TX_HASH_POSTER } from '../graphQL/postQueries';

export const pollTXHash = async ({ chainID, txHash }) => {
  return graphQuery({
    endpoint: getGraphEndpoint(chainID, 'subgraph_url'),
    query: TX_HASH,
    variables: {
      id: txHash,
    },
  });
};

export const pollPosterTXHash = async ({ chainID, txHash }) => {
  return graphQuery({
    endpoint: getGraphEndpoint(chainID, 'poster_graph_url'),
    query: TX_HASH_POSTER,
    variables: {
      transactionHash: txHash,
    },
  });
};

export const pollBoostTXHash = async ({ chainID, txHash }) => {
  return graphQuery({
    endpoint: getGraphEndpoint(chainID, 'boosts_graph_url'),
    query: TX_HASH,
    variables: {
      id: txHash,
    },
  });
};

export const pollWrapNZap = async ({ chainID, contractAddress }) => {
  const rpcUrl = supportedChains[chainID].rpc_url;
  const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  const pollFinal = await web3.eth.getBalance(
    contractAddress,
    (error, result) => {
      if (error) {
        console.log('Error detecting Wrap-N-Zap poke balance.', error);
        return false;
      }
      console.log('Wrap-N-Zap Poke Balance', result);
      return result;
    },
  );
  return pollFinal;
};

export const pollTokenAllowances = async ({
  chainID,
  daoID,
  tokenAddress,
  userAddress,
}) => {
  const tokenContract = createContract({
    address: tokenAddress,
    abi: LOCAL_ABI.ERC_20,
    chainID,
  });

  const amountApproved = await tokenContract.methods
    .allowance(userAddress, daoID)
    .call();

  return amountApproved;
};

export const pollTokenApproval = async ({
  chainID,
  contractAddress,
  userAddress,
  controllerAddress,
}) => {
  const tokenContract = NFTService({
    chainID,
    tokenAddress: contractAddress,
  });

  const args = [userAddress, controllerAddress];
  const approved = await tokenContract('isApprovedForAll')({
    args,
    userAddress,
  });
  return approved;
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

export const pollSupertokenCreated = async ({
  chainID,
  underlyingTokenAddress,
  createdAt,
}) => {
  const sfConfig = supportedChains[chainID].superfluid;
  return graphQuery({
    endpoint: sfConfig.subgraph_url_v2,
    query: SF_SUPERTOKEN_CREATED,
    variables: {
      underlyingTokenAddress,
      createdAt,
    },
  });
};

export const pollMinionExecuteAction = async ({
  chainID,
  minionAddress,
  proposalId,
  tx,
  proposalType,
}) => {
  try {
    const web3Contract = createContract({
      address: minionAddress,
      abi: await getContractABI({ tx }),
      chainID,
    });
    const actionName =
      MINION_ACTION_FUNCTION_NAMES[tx.contract.abiName] ||
      MINION_ACTION_FUNCTION_NAMES[proposalType];
    const actionValue = await web3Contract.methods[actionName](
      Number(proposalId),
    ).call();
    return actionValue.executed;
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
    const newTokenBalance = member?.tokenBalances?.find(
      tokenObj => tokenObj.token.tokenAddress === tokenAddress,
    )?.tokenBalance;
    return newTokenBalance;
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
    const tokenContract = createContract({
      address: tokenAddress,
      abi: LOCAL_ABI.ERC_20,
      chainID,
    });

    const newTokenBalance = await tokenContract.methods
      .balanceOf(uberMinionAddress)
      .call();

    return newTokenBalance;
  } catch (error) {
    return error;
  }
};
