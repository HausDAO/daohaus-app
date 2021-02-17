import {
  determineProposalStatus,
  determineProposalType,
  titleMaker,
  descriptionMaker,
  linkMaker,
  hashMaker,
  determineUnreadActivityFeed,
  forumIdMaker,
} from './proposalUtils';

import { getTotalBankValue } from './tokenValue';

export const proposalResolver = (proposal, fields = {}) => {
  if (fields.status) {
    proposal.status = determineProposalStatus(proposal);
  }
  if (fields.title) {
    proposal.title = titleMaker(proposal);
  }
  if (fields.description) {
    proposal.description = descriptionMaker(proposal);
  }
  if (fields.link) {
    proposal.link = linkMaker(proposal);
  }
  if (fields.hash) {
    proposal.hash = hashMaker(proposal);
  }
  if (fields.forumId) {
    proposal.forumId = forumIdMaker(proposal);
  }
  if (fields.proposalType) {
    proposal.proposalType = determineProposalType(proposal);
  }
  if (fields.activityFeed) {
    proposal.activityFeed = determineUnreadActivityFeed(proposal);
  }

  return proposal;
};

export const daoResolver = (dao, context) => {
  if (dao.version === '1') {
    const usdPrice = context.prices[dao.depositToken.tokenAddress] || {
      price: 0,
    };
    dao.guildBankValue =
      usdPrice.price *
      (dao.guildBankBalanceV1 / 10 ** dao.depositToken.decimals);
  } else {
    dao.guildBankValue = getTotalBankValue(dao.tokenBalances, context.prices);
  }

  dao.networkId = context.chain.network_id;

  return dao;
};
