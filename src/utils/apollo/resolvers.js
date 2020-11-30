import Web3 from 'web3';
import { getProfile } from '3box/lib/api';

import {
  determineProposalStatus,
  inGracePeriod,
  inVotingPeriod,
  inQueue,
  passedVotingAndGrace,
  determineProposalType,
  descriptionMaker,
  hashMaker,
  titleMaker,
  determineUnreadActivityFeed,
} from '../proposal-helper';
import { TokenService } from '../token-service';
import { MolochService } from '../moloch-service';

const _web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.REACT_APP_RPC_URI),
);

export const resolvers = {
  Proposal: {
    status: (proposal, _args, _context) => {
      const currentPeriod = _context.currentPeriod;
      return determineProposalStatus(
        proposal,
        +currentPeriod,
        +proposal.moloch.votingPeriodLength,
        +proposal.moloch.gracePeriodLength,
        +proposal.moloch.version,
      );
    },
    gracePeriod: (proposal, _args, _context) => {
      const currentPeriod = _context.currentPeriod;
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
    votingEnds: (proposal, _args, _context) => {
      const currentPeriod = _context.currentPeriod;

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
    votingStarts: (proposal, _args, _context) => {
      const currentPeriod = _context.currentPeriod;
      if (inQueue(proposal, currentPeriod)) {
        return proposal.startingPeriod - currentPeriod;
      }
      return 0;
    },
    readyForProcessing: (proposal, _args, _context) => {
      const currentPeriod = _context.currentPeriod;
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
    proposalType: (proposal, _args, _context) => {
      return determineProposalType(proposal);
    },
    title: (proposal) => {
      return titleMaker(proposal);
    },
    description: (proposal) => {
      return descriptionMaker(proposal);
    },
    hash: (proposal) => {
      return hashMaker(proposal);
    },
    activityFeed: (proposal) => {
      return determineUnreadActivityFeed(proposal);
    },
  },

  TokenBalance: {
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
        const molochService = new MolochService(
          _web3,
          tokenBalance.moloch.id,
          null,
          2,
        );

        const balance = await molochService.getUserTokenBalance(
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
  Member: {
    profile: async (member) => {
      let profile;
      try {
        profile = await getProfile(member.memberAddress);
      } catch (err) {}

      return profile;
    },
  },
};
