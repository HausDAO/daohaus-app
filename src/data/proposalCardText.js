export const propStatusText = {
  Unsponsored:
    'A member of the DAO can sponsor this proposal, moving it into the Voting Queue.',
  cancelled: 'This proposal has been struck down.',
  approve: symbol =>
    symbol
      ? `You need to approve ${symbol} in order to sponsor this proposal`
      : `You need to approve deposit token in order to sponsor this proposal`,
  noFunds: symbol =>
    symbol
      ? `You don't have enough ${symbol} to sponsor this proposal`
      : `You don't have enough deposit token to sponsor this proposal`,
};
