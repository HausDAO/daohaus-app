import Web3 from 'web3';

import {
  determineProposalStatus,
  inGracePeriod,
  inVotingPeriod,
  inQueue,
  passedVotingAndGrace,
} from './ProposalHelper';
import { GET_METADATA } from './Queries';
import { TokenService } from './TokenService';

import config from '../config';

const _web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));

export const resolversV2 = {
  Proposal: {
    status: (proposal, _args, { cache }) => {
      const {
        currentPeriod,
        votingPeriodLength,
        gracePeriodLength,
      } = cache.readQuery({ query: GET_METADATA });
      return determineProposalStatus(
        proposal,
        +currentPeriod,
        +votingPeriodLength,
        +gracePeriodLength,
      );
    },
    gracePeriod: (proposal, _args, { cache }) => {
      const {
        currentPeriod,
        votingPeriodLength,
        gracePeriodLength,
      } = cache.readQuery({ query: GET_METADATA });

      if (
        inGracePeriod(
          proposal,
          currentPeriod,
          votingPeriodLength,
          gracePeriodLength,
        )
      ) {
        return (
          +proposal.startingPeriod +
          votingPeriodLength +
          gracePeriodLength -
          currentPeriod +
          1 // TODO: why plus 1 here? abort? ¯\_(ツ)_/¯
        );
      }
      return 0;
    },
    votingEnds: (proposal, _args, { cache }) => {
      const { currentPeriod, votingPeriodLength } = cache.readQuery({
        query: GET_METADATA,
      });

      if (inVotingPeriod(proposal, currentPeriod, votingPeriodLength)) {
        return proposal.startingPeriod + votingPeriodLength - currentPeriod;
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
      const {
        currentPeriod,
        votingPeriodLength,
        gracePeriodLength,
      } = cache.readQuery({ query: GET_METADATA });
      if (
        passedVotingAndGrace(
          proposal,
          currentPeriod,
          votingPeriodLength,
          gracePeriodLength,
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
    },
  },
  Token: {
    symbol: async (approvedToken, _args, { cache }) => {
      const tokenService = new TokenService(_web3, approvedToken.tokenAddress);
      const symbol = await tokenService.getSymbol();
      return symbol;
    },
  },
};
