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
// import { TokenService } from '../token-service';
// import { MolochService } from '../moloch-service';

// const rpcUrl =
// chainData.network_id === 100
//   ? 'https://dai.poa.network '
//   : `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;

const _web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.REACT_APP_MAINNET_RPC_URI),
);

console.log('_web3 in resolver', _web3);

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
    contractTokenBalance: async (tokenBalance, _args, { cache }) => {
      // if (tokenBalance.guildBank) {
      //   const tokenService = new TokenService(
      //     _web3,
      //     tokenBalance.token.tokenAddress,
      //   );

      //   const balance = await tokenService.balanceOf(tokenBalance.moloch.id);

      //   return +balance;
      // } else {
      //   return null;
      // }

      return null;
    },
    tokenTotalSupply: async (tokenBalance, _args, { cache }) => {
      // if (tokenBalance.guildBank) {
      //   const tokenService = new TokenService(
      //     _web3,
      //     tokenBalance.token.tokenAddress,
      //   );

      //   const totalSupply = await tokenService.totalSupply();

      //   return +totalSupply;
      // } else {
      //   return null;
      // }

      return null;
    },
    contractBabeBalance: async (tokenBalance, _args, { cache }) => {
      // if (tokenBalance.guildBank) {
      //   const molochService = new MolochService(
      //     _web3,
      //     tokenBalance.moloch.id,
      //     null,
      //     2,
      //   );

      //   const balance = await molochService.getUserTokenBalance(
      //     '0x000000000000000000000000000000000000baBe',
      //     tokenBalance.token.tokenAddress,
      //   );

      //   return +balance;
      // } else {
      //   return null;
      // }

      return null;
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
