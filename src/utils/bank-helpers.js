export const getTotalBankValue = (tokenBalances, prices) => {
  return tokenBalances.reduce((sum, balance) => {
    if (balance.guildBank) {
      const price = prices[balance.token.tokenAddress.toLowerCase()]
        ? prices[balance.token.tokenAddress.toLowerCase()].price
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

export const getDateRange = (timeframe, balances, createdAt) => {
  if (timeframe.value === 'lifetime') {
    return {
      start: createdAt
        ? new Date(createdAt * 1000)
        : new Date(balances[0].timestamp * 1000),
      end: new Date(balances[balances.length - 1].timestamp * 1000),
    };
  } else {
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
        prices[balance.tokenAddress].price;

      list.push({
        ...balance,
        usdPrice: prices[balance.tokenAddress].price,
        value,
      });
    }
    return list;
  }, []);
};

export const groupBalancesToDateRange = (balances, dates) => {
  const groupedByToken = groupBy(balances, 'tokenAddress');
  let dateBalances = dates.map((date, i) => {
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

  if (!dateBalances.some((bal) => bal.value > 0)) {
    dateBalances = dateBalances.map((bal) => {
      bal.value = balances[balances.length - 1].value;
      return bal;
    });
  }

  return dateBalances;
};

export const groupBalancesMemberToDateRange = (balances, dates) => {
  return dates.map((date, i) => {
    let balance;
    if (i === 0) {
      balance = { currentShares: 0, currentLoot: 0 };
    } else {
      balance = balances.find((bal) => +bal.timestamp >= date.getTime() / 1000);
    }

    return {
      date,
      currentShares: balance ? +balance.currentShares : 0,
      currentLoot: balance ? +balance.currentLoot : 0,
    };
  });
};

const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
