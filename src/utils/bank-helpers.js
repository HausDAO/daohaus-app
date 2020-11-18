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
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - timeframe.value);
    return {
      start: startDate,
      end: today,
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
// where to get total?
// maybe groupBalancesToDateRange on each token with a price
// then add

export const groupBalancesToDateRange = (balances, dates) => {
  const groupedByToken = groupBy(balances, 'tokenAddress');

  console.log('groupedByToken', groupedByToken);

  return dates.map((date, i) => {
    // for each Object.keys(groupedByToken)
    // const dateObj = {
    //   date,
    // };
    // Object.keys(groupedByToken).reduce((tokenAddress) => {
    //   const nextBal = balances.find(
    //     (bal) => +bal.timestamp >= date.getTime() / 1000,
    //   );

    // }, 0);

    const nextBal = balances.find(
      (bal) => +bal.timestamp >= date.getTime() / 1000,
    );
    return {
      date,
      balance: nextBal || balances[balances.length - 1],
    };
  });
};

const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
