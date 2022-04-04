import humanFormat from 'human-format';
import { chainByID } from './chain';
import { formatDate, handleNounCase, NOUN } from './general';
import { memberVote } from './proposalUtils';
import { getReadableBalance } from './tokenValue';

export const readableNumber = ({
  amount,
  unit,
  decimals = 1,
  separator = '',
}) => {
  if (amount == null) return null;
  if (amount > 0 && amount < 1) {
    return `${Number(amount.toFixed(4))} ${unit}`;
  }
  if (unit) {
    return `${humanFormat(amount, {
      unit: ` ${unit}`,
      decimals,
      separator,
    })}`;
  }
  return `${humanFormat(amount, {
    decimals,
    separator,
  })}`;
};

export const readableTokenBalance = tokenData => {
  const { balance, decimals, symbol } = tokenData || {};
  if (!balance || !decimals || !symbol) return null;
  const readableBalance = getReadableBalance(tokenData);
  if (readableBalance == null) return null;
  return readableNumber({ amount: readableBalance, unit: symbol });
};

const getSharesReadable = sharesRequested =>
  Number(sharesRequested)
    ? readableNumber({
        unit: handleNounCase(sharesRequested, NOUN.SHARES),
        amount: Number(sharesRequested),
      })
    : '';
const getLootReadable = lootRequested =>
  Number(lootRequested)
    ? readableNumber({
        unit: handleNounCase(lootRequested, NOUN.LOOT),
        amount: Number(lootRequested),
      })
    : '';
const getPaymentReadable = ({
  paymentRequested,
  paymentTokenDecimals,
  paymentTokenSymbol,
}) =>
  Number(paymentRequested)
    ? readableTokenBalance({
        decimals: paymentTokenDecimals,
        balance: paymentRequested,
        symbol: paymentTokenSymbol,
      })
    : '';

export const generateProposalDateText = dateTimeMillis => {
  return formatDate(dateTimeMillis, "hh:mm aaaaa'm' MMM dd, yyyy");
};

export const generateRequestText = proposal => {
  const {
    paymentRequested,
    paymentTokenDecimals,
    paymentTokenSymbol,
    sharesRequested,
    lootRequested,
  } = proposal;

  return [
    getSharesReadable(sharesRequested),
    getLootReadable(lootRequested),
    getPaymentReadable({
      paymentRequested,
      paymentTokenDecimals,
      paymentTokenSymbol,
    }),
  ]
    .filter(Boolean)
    .join(', ');
};

export const generateRQText = proposal => {
  const { sharesToBurn, lootToBurn } = proposal;

  return [getSharesReadable(sharesToBurn), getLootReadable(lootToBurn)]
    .filter(Boolean)
    .join(', ');
};

export const generateOfferText = proposal => {
  const { tributeOffered, tributeTokenDecimals, tributeTokenSymbol } = proposal;
  const tributeReadable = Number(tributeOffered)
    ? readableTokenBalance({
        decimals: tributeTokenDecimals,
        balance: tributeOffered,
        symbol: tributeTokenSymbol,
      })
    : '';
  //  'NFT offered' logic here
  const text = [tributeReadable].filter(Boolean).join(', ');
  return text;
};

export const getChainName = chainID => {
  return chainByID(chainID).name;
};

export const cheatExecutionStatus = (proposalId, daoid) => {
  const executeStorage =
    JSON.parse(sessionStorage.getItem(`needsExecution-${daoid}`)) || [];
  const newStorage = JSON.stringify([...executeStorage, proposalId]);
  sessionStorage.setItem(`needsExecution-${daoid}`, newStorage);
};

export const removeExecutionCheat = (proposalId, daoid) => {
  const executeStorage = JSON.parse(
    sessionStorage.getItem(`needsExecution-${daoid}`),
  );
  if (!Array.isArray(executeStorage)) return;
  const newStorage = JSON.stringify(
    executeStorage.filter(id => id !== proposalId),
  );
  sessionStorage.setItem(`needsExecution-${daoid}`, newStorage);
};

export const getVoteData = (proposal, address, daoMember) => {
  const hasVoted = memberVote(proposal, address);
  const votedYes = hasVoted === 1;
  const votedNo = hasVoted === 2;
  const userYes = votedYes && Number(daoMember?.shares);
  const userNo = votedNo && Number(daoMember?.shares);
  const totalYes = Number(proposal?.yesShares);
  const totalNo = Number(proposal?.noShares);
  const totalVotes = Number(proposal?.yesShares) + Number(proposal?.noShares);
  const isPassing = totalYes > totalNo;
  const isFailing = totalNo > totalYes;

  return {
    hasVoted,
    votedYes,
    votedNo,
    userYes,
    userNo,
    userYesReadable:
      daoMember && userYes && `(+${readableNumber({ amount: userYes })})`,
    userNoReadable:
      daoMember && userNo && `(+${readableNumber({ amount: userNo })})`,
    totalYes,
    totalNo,
    totalYesReadable: `(${readableNumber({ amount: totalYes })})`,
    totalNoReadable: `(${readableNumber({ amount: totalNo })})`,
    totalVotes,
    isPassing,
    isFailing,
    votePassedProcessFailed:
      isPassing && proposal.processed && !proposal.didPass,
  };
};
