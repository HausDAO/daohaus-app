import Web3 from 'web3';

import {
  determineProposalStatus,
  inGracePeriod,
  inVotingPeriod,
  inQueue,
  passedVotingAndGrace,
  determineProposalType,
} from './ProposalHelper';
import { TokenService } from './TokenService';
import { McDaoService } from './McDaoService';
import { GET_METADATA } from './Queries';

const _web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_URI),
);

export const resolvers = {
  Proposal: {
    status: (proposal, _args, { cache }) => {
      const { currentPeriod } = cache.readQuery({
        query: GET_METADATA,
      });

      return determineProposalStatus(
        proposal,
        +currentPeriod,
        +proposal.moloch.votingPeriodLength,
        +proposal.moloch.gracePeriodLength,
        +proposal.moloch.version,
      );
    },
    gracePeriod: (proposal, _args, { cache }) => {
      const { currentPeriod } = cache.readQuery({
        query: GET_METADATA,
      });

      if (
        inGracePeriod(
          proposal,
          currentPeriod,
          +proposal.moloch.votingPeriodLength,
          +proposal.moloch.gracePeriodLength,
        )
      ) {
        return (
          +proposal.startingPeriod +
          +proposal.moloch.votingPeriodLength +
          +proposal.moloch.gracePeriodLength -
          currentPeriod +
          1 // TODO: why plus 1 here? abort? ¯\_(ツ)_/¯
        );
      }
      return 0;
    },
    votingEnds: (proposal, _args, { cache }) => {
      const { currentPeriod } = cache.readQuery({
        query: GET_METADATA,
      });

      if (
        inVotingPeriod(
          proposal,
          currentPeriod,
          +proposal.moloch.votingPeriodLength,
        )
      ) {
        return (
          proposal.startingPeriod +
          +proposal.moloch.votingPeriodLength -
          currentPeriod
        );
      }
      return 0;
    },
    votingStarts: (proposal, _args, { cache }) => {
      const { currentPeriod } = cache.readQuery({ query: GET_METADATA });
      if (inQueue(proposal, currentPeriod)) {
        return proposal.startingPeriod - currentPeriod;
      }
      return 0;
    },
    readyForProcessing: (proposal, _args, { cache }) => {
      const { currentPeriod } = cache.readQuery({ query: GET_METADATA });
      if (
        passedVotingAndGrace(
          proposal,
          currentPeriod,
          +proposal.moloch.votingPeriodLength,
          +proposal.moloch.gracePeriodLength,
          +proposal.moloch.version,
        ) &&
        !proposal.processed
      ) {
        return true;
      }
      return false;
    },
    proposalType: (proposal, _args, { cache }) => {
      return determineProposalType(proposal);
    },
  },

  Moloch: {
    meta: (_, _args, { cache }) => {
      return cache.readQuery({
        query: GET_METADATA,
      });
    },
  },
  TokenBalance: {
    symbol: async (tokenBalance, _args, { cache }) => {
      if (tokenBalance.guildBank) {
        const symbol = tokenBalance.token.symbol;

        return symbol;
      } else {
        return null;
      }

      // return null;
    },
    decimals: async (tokenBalance, _args, { cache }) => {
      if (tokenBalance.guildBank) {
        const decimals = tokenBalance.token.decimals;

        return +decimals;
      } else {
        return null;
      }
    },
    contractTokenBalance: async (tokenBalance, _args, { cache }) => {
      if (tokenBalance.guildBank) {
        const tokenService = new TokenService(
          _web3,
          tokenBalance.token.tokenAddress,
        );

        const balance = await tokenService.balanceOf(tokenBalance.moloch.id);

        return +balance;
      } else {
        return null;
      }
    },
    tokenTotalSupply: async (tokenBalance, _args, { cache }) => {
      if (tokenBalance.guildBank) {
        const tokenService = new TokenService(
          _web3,
          tokenBalance.token.tokenAddress,
        );

        const totalSupply = await tokenService.totalSupply();

        return +totalSupply;
      } else {
        return null;
      }
    },
    contractBabeBalance: async (tokenBalance, _args, { cache }) => {
      if (tokenBalance.guildBank) {
        const mcDaoService = new McDaoService(
          _web3,
          tokenBalance.moloch.id,
          null,
          2,
        );

        const balance = await mcDaoService.getUserTokenBalance(
          '0x000000000000000000000000000000000000baBe',
          tokenBalance.token.tokenAddress,
        );

        return +balance;
      } else {
        return null;
      }
    },
  },
  Token: {
    symbol: async (approvedToken, _args, { cache }) => {
      const symbol = approvedToken.symbol;
      return symbol;
    },
    decimals: async (approvedToken, _args, { cache }) => {
      const decimals = approvedToken.decimals;

      return +decimals;
    },
  },
};
