export const getDateRange = (timeframe, balances, createdAt) => {
  if (timeframe.value === 'lifetime') {
    return {
      start: createdAt
        ? new Date(createdAt * 1000)
        : new Date(balances[0].timestamp * 1000),
      end: new Date(balances[balances.length - 1].timestamp * 1000),
    };
  }
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - timeframe.value);
  if (startDate.getTime() < +createdAt * 1000) {
    startDate = new Date(createdAt * 1000);
  }

  let endDate = new Date(balances[balances.length - 1].timestamp * 1000);
  if (endDate.getTime() < startDate.getTime()) {
    endDate = new Date();
  }

  return {
    start: startDate,
    end: endDate,
  };
};

export const addDays = (date, days = 1) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date, days = 1) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const getDatesArray = (start, end, range = []) => {
  if (start > end) {
    // return range.length === 1 ? [...range, addDays(range[0], 7)] : range;
    return range;
  }
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
  let dateBalances = dates.map(date => {
    const value = Object.keys(groupedByToken).reduce((sum, tokenAddress) => {
      const nextBal = groupedByToken[tokenAddress].find(
        bal => +bal.timestamp >= date.getTime() / 1000,
      );
      sum += nextBal ? nextBal.value : 0;
      return sum;
    }, 0);

    return {
      date,
      value,
    };
  });

  if (!dateBalances.some(bal => bal.value > 0)) {
    dateBalances = dateBalances.map(bal => {
      bal.value = balances[balances.length - 1].value;
      return bal;
    });
  }

  return dateBalances;
};

export const groupBalancesMemberToDateRange = (balances, dates) => {
  return dates.map(date => {
    const balance = balances.find(
      bal => +bal.timestamp >= date.getTime() / 1000,
    );

    return {
      date,
      currentShares: balance ? +balance.currentShares : 0,
      currentLoot: balance ? +balance.currentLoot : 0,
    };
  });
};
