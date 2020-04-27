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
import { GET_METADATA_SUPER } from './QueriesSuper';
import config from '../config';

const _web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));

export const resolvers = {
  Proposal: {
    status: (proposal, _args, { cache }) => {
      const { currentPeriod } = cache.readQuery({
        query: GET_METADATA_SUPER,
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
        query: GET_METADATA_SUPER,
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
        query: GET_METADATA_SUPER,
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
      const { currentPeriod } = cache.readQuery({ query: GET_METADATA_SUPER });
      if (inQueue(proposal, currentPeriod)) {
        return proposal.startingPeriod - currentPeriod;
      }
      return 0;
    },
    readyForProcessing: (proposal, _args, { cache }) => {
      const { currentPeriod } = cache.readQuery({ query: GET_METADATA_SUPER });
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
    tributeTokenSymbol: async (proposal, _args, { cache }) => {
      const tokenService = new TokenService(_web3, proposal.tributeToken);
      const symbol = await tokenService.getSymbol();
      return symbol;
    },
    tributeTokenDecimals: async (proposal, _args, { cache }) => {
      const tokenService = new TokenService(_web3, proposal.tributeToken);
      const decimals = await tokenService.getDecimals();
      return +decimals;
    },
    paymentTokenSymbol: async (proposal, _args, { cache }) => {
      if (proposal.trade) {
        const tokenService = new TokenService(_web3, proposal.paymentToken);
        const symbol = await tokenService.getSymbol();
        return symbol;
      } else {
        return null;
      }
    },
    paymentTokenDecimals: async (proposal, _args, { cache }) => {
      if (proposal.trade) {
        const tokenService = new TokenService(_web3, proposal.paymentToken);
        const decimals = await tokenService.getDecimals();
        return +decimals;
      } else {
        return null;
      }
    },
    proposalType: (proposal, _args, { cache }) => {
      return determineProposalType(proposal);
    },
  },

  Moloch: {
    meta: (_, _args, { cache }) => {
      return cache.readQuery({
        query: GET_METADATA_SUPER,
      });
    },
  },
  TokenBalance: {
    symbol: async (tokenBalance, _args, { cache }) => {
      if (tokenBalance.guildBank) {
        const tokenService = new TokenService(
          _web3,
          tokenBalance.token.tokenAddress,
        );
        const symbol = await tokenService.getSymbol();

        return symbol;
      } else {
        return null;
      }

      // return null;
    },
    decimals: async (tokenBalance, _args, { cache }) => {
      if (tokenBalance.guildBank) {
        const tokenService = new TokenService(
          _web3,
          tokenBalance.token.tokenAddress,
        );

        const decimals = await tokenService.getDecimals();

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

        return balance;
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

        return balance;
      } else {
        return null;
      }
    },
  },
  Token: {
    symbol: async (approvedToken, _args, { cache }) => {
      const tokenService = new TokenService(_web3, approvedToken.tokenAddress);
      const symbol = await tokenService.getSymbol();
      return symbol;
    },
    decimals: async (approvedToken, _args, { cache }) => {
      const tokenService = new TokenService(_web3, approvedToken.tokenAddress);

      const decimals = await tokenService.getDecimals();

      return +decimals;
    },
  },
};
