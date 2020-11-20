export const getTotalBankValue = (tokenBalances, prices) => {
  return tokenBalances.reduce((sum, balance) => {
    if (balance.guildBank) {
      const price = prices[balance.token.tokenAddress.toLowerCase()]
        ? prices[balance.token.tokenAddress.toLowerCase()].usd
        : 0;
      const value =
        (+balance.tokenBalance / 10 ** balance.token.decimals) * price;

      return (sum += value);
    } else {
      return sum;
    }
  }, 0);
};

const addDays = (date, days = 1) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDateRange = (timeframe, balances) => {
  if (timeframe.value === 'lifetime') {
    return {
      start: new Date(balances[0].timestamp * 1000),
      end: new Date(balances[balances.length - 1].timestamp * 1000),
    };
  } else {
    const today = new Date();
    const startDate = new Date(balances[balances.length - 1].timestamp * 1000);
    startDate.setMonth(today.getMonth() - timeframe.value);
    return {
      start: startDate,
      end: new Date(balances[balances.length - 1].timestamp * 1000),
    };
  }
};

export const getDatesArray = (start, end, range = []) => {
  if (start > end) return range;
  const next = addDays(start, 7);
  return getDatesArray(next, end, [...range, start]);
};

export const balancesWithValue = (balances, prices) => {
  return balances.reduce((list, balance) => {
    if (prices[balance.tokenAddress]) {
      const value =
        (balance.balance / 10 ** balance.tokenDecimals) *
        prices[balance.tokenAddress].usd;

      list.push({
        ...balance,
        usdPrice: prices[balance.tokenAddress].usd,
        value,
      });
    }
    return list;
  }, []);
};

export const groupBalancesToDateRange = (balances, dates) => {
  const groupedByToken = groupBy(balances, 'tokenAddress');
  return dates.map((date, i) => {
    const value = Object.keys(groupedByToken).reduce((sum, tokenAddress) => {
      const nextBal = groupedByToken[tokenAddress].find(
        (bal) => +bal.timestamp >= date.getTime() / 1000,
      );
      sum += nextBal ? nextBal.value : 0;
      return sum;
    }, 0);

    return {
      date,
      value,
    };
  });
};

const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
