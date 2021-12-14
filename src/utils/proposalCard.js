import humanFormat from 'human-format';
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

export const generateRequestText = proposal => {
  const {
    paymentRequested,
    paymentTokenDecimals,
    paymentTokenSymbol,
    sharesRequested,
    lootRequested,
  } = proposal;
  const paymentReadable = Number(paymentRequested)
    ? readableTokenBalance({
        decimals: paymentTokenDecimals,
        balance: paymentRequested,
        symbol: paymentTokenSymbol,
      })
    : '';

  const sharesReadable = Number(sharesRequested)
    ? readableNumber({ unit: 'Shares', amount: Number(sharesRequested) })
    : '';
  const lootReadable = Number(lootRequested)
    ? readableNumber({ unit: 'Loot', amount: Number(lootRequested) })
    : '';

  return [sharesReadable, lootReadable, paymentReadable]
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
  const votedNo = hasVoted === 0;
  const userYes = votedYes && Number(daoMember?.shares);
  const userNo = votedNo && Number(daoMember?.shares);
  const totalYes = Number(proposal?.yesShares);
  const totalNo = Number(proposal?.noShares);
  const totalVotes = Number(proposal?.yesShares) + Number(proposal?.noShares);
  const isPassing = totalYes > totalNo;
  return {
    hasVoted,
    votedYes,
    votedNo,
    userYes,
    userNo,
    userYesReadable:
      daoMember && userYes && `(${readableNumber({ amount: userYes })})`,
    userNoReadable:
      daoMember && userNo && `(${readableNumber({ amount: userNo })})`,
    totalYes,
    totalNo,
    totalYesReadable: `(${readableNumber({ amount: totalYes })})`,
    totalNoReadable: `(${readableNumber({ amount: totalNo })})`,
    totalVotes,
    isPassing,
  };
};
