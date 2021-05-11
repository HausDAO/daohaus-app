import { ccoStatus, currentFunded } from './cco';
import {
  determineProposalStatus,
  determineProposalType,
  titleMaker,
  descriptionMaker,
  linkMaker,
  hashMaker,
  determineUnreadActivityFeed,
} from './proposalUtils';

import { getTotalBankValue } from './tokenValue';

//  TODO. Can be made a lot more effecient. We are parsing JSON for each of these fields.
//  Would be better if there was a way to parse once since JSON.parse is relatively expensive.
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

export const daosqaureCcoDaoResolver = (dao, now) => {
  const fundedWei = currentFunded(
    dao.meta.boosts.daosquarecco.metadata,
    dao.proposals,
  );
  const ccoFundedAmount = fundedWei / 10 ** 18;
  dao.ccoFundedAmount = ccoFundedAmount;
  dao.ccoStatus = ccoStatus(
    dao.meta.boosts.daosquarecco.metadata,
    ccoFundedAmount,
    now,
  );

  return dao;
};
