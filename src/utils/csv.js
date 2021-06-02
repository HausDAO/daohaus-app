const validElement = key => {
  return (
    // filter out internal graph & app values
    key !== '__typename' &&
    key !== 'id' &&
    key !== 'details' &&
    key !== 'hash' &&
    // filter out possible nested objects & arrays
    key !== 'moloch' &&
    key !== 'minion' &&
    key !== 'votes' &&
    key !== 'highestIndexYesVote' &&
    key !== 'tokenBalances' &&
    key !== 'submissions'
  );
};

const csvCleaner = list => {
  return list.map(item => {
    return Object.keys(item).reduce((newItem, elmKey) => {
      if (validElement(elmKey, item[elmKey])) {
        newItem[elmKey] = item[elmKey];
      }
      return newItem;
    }, {});
  });
};

export const prepCsvData = list => {
  const cleanedList = csvCleaner(list);
  const header = Object.keys(cleanedList[0]).join(',');
  const values = cleanedList
    .map(o => {
      return Object.values(o)
        .map(val => (val === null ? `""` : `"${val}"`))
        .join(',');
    })
    .join('\n');
  return `${header}\n${values}`;
};

export const downloadFromBrowser = (csvArray, filename) => {
  const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
