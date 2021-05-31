const validElement = (key, value) => {
  return typeof value !== 'object' && key !== '__typename' && key !== 'id';
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
  const values = cleanedList.map(o => Object.values(o).join(',')).join('\n');
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
