import Web3 from 'web3';
import { getProfile } from '3box/lib/api';

import {
  determineProposalStatus,
  determineProposalType,
  descriptionMaker,
  hashMaker,
  titleMaker,
  determineUnreadActivityFeed,
} from '../proposal-helper';
import { TokenService } from '../token-service';
import { MolochService } from '../moloch-service';

export const resolvers = {
  Proposal: {
    status: (proposal) => {
      return determineProposalStatus(proposal, proposal.moloch);
    },
    proposalType: (proposal) => {
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
    contractBalances: async (tokenBalance, _args, context) => {
      const rpcUrl =
        context.network.network === 'xdai'
          ? 'https://dai.poa.network '
          : `https://${context.network.network}.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
      const _web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

      let token, babe;

      if (tokenBalance.guildBank) {
        const tokenService = new TokenService(
          _web3,
          tokenBalance.token.tokenAddress,
        );

        const balance = await tokenService.balanceOf(tokenBalance.moloch.id);

        token = +balance;

        const molochService = new MolochService(
          _web3,
          tokenBalance.moloch.id,
          null,
          2,
        );

        const babeBalance = await molochService.getUserTokenBalance(
          '0x000000000000000000000000000000000000baBe',
          tokenBalance.token.tokenAddress,
        );

        babe = +babeBalance;
      } else {
        token = null;
        babe = null;
      }

      return {
        token,
        babe,
      };
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
    networkId: (member, _args, context) => {
      return context.networkId;
    },
    hubSort: (member, _args, context) => {
      if (context.networkId === '4') {
        return 4;
      } else if (context.networkId === '42') {
        return 3;
      } else if (context.networkId === '100') {
        return 2;
      } else if (context.networkId === '1') {
        return 1;
      }
    },
    profile: async (member) => {
      let profile;
      try {
        profile = await getProfile(member.memberAddress);
      } catch (err) {}

      return profile;
    },
  },
};
