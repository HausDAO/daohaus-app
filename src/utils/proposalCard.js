import humanFormat from 'human-format';
import { getReadableBalance } from './tokenValue';

export const readableNumber = ({
  amount,
  unit,
  decimals = 1,
  separator = '',
}) => {
  if (amount == null || unit == null) return null;
  if (amount > 0 && amount < 1) {
    return `${Number(amount.toFixed(4))} ${unit}`;
  }
  return `${humanFormat(amount, {
    unit: ` ${unit}`,
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
