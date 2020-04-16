import { gql } from 'apollo-boost';
import Web3 from 'web3';

import {
  determineProposalStatus,
  inGracePeriod,
  inVotingPeriod,
  inQueue,
  passedVotingAndGrace,
} from './ProposalHelper';
import { TokenService } from './TokenService';
import { McDaoService } from './McDaoService';
import { GET_METADATA } from './Queries';
import { GET_METADATA_SUPER } from './QueriesSuper';
import config from '../config';

const _web3 = new Web3(new Web3.providers.HttpProvider(config.INFURA_URI));

export const resolvers = {
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
  },
  Mutation: {
    setAttributes: (_, variables, { cache }) => {
      const id = `Proposal:${variables.id}`;
      const fragment = gql`
        fragment getMeta on Proposal {
          status
          gracePeriod
          votingEnds
          votingStarts
          readyForProcessing
        }
      `;
      const proposal = cache.readFragment({ fragment, id });
      const data = {
        ...proposal,
        status: variables.status,
        title: variables.title,
        description: variables.description,
        gracePeriod: variables.gracePeriod,
        votingEnds: variables.votingEnds,
        votingStarts: variables.votingStarts,
        readyForProcessing: variables.readyForProcessing,
      };
      cache.writeData({ id, data });
      return data;
    },
  },
  // SUPER STUFF BELOW
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
};
