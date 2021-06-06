import { filterObject, isObjectEmpty } from './general';

export const splitMulti = (key, value) => {
  const splitKey = key.split('*MULTI*');
  return { key: splitKey[0], value, order: splitKey[1] };
};

export const collapseToObjOfArrays = multis => {
  const newObj = {};
  for (const multi in multis) {
    const data = splitMulti(multi, multis[multi]);
    if (data.value) {
      if (newObj[data.key]) {
        newObj[data.key][data.order] = data.value;
      } else {
        newObj[data.key] = [data.value];
      }
    }
  }
  return newObj;
};

export const collapse = (values, flag, collapseType) => {
  const groupedItems = filterObject(
    values,
    (value, key) => key.includes(flag) && value,
  );
  if (isObjectEmpty(groupedItems)) return values;
  const nonGrouped = filterObject(
    values,
    (value, key) => !key.includes(flag) && value,
  );
  if (collapseType === 'multi') {
    return { ...collapseToObjOfArrays(groupedItems), ...nonGrouped };
  }
  if (collapseType === 'singleField') {
    return { [flag]: Object.values(groupedItems), ...nonGrouped };
  }
  throw new Error('did not recieve collapseType');
};

export const mapInRequired = (fields, required) => {
  return fields.map(field =>
    required.includes(field.name) ? { ...field, required: true } : field,
  );
};

export const inputDataFromABI = inputs => {
  const getType = type => {
    if (type === 'string' || type === 'address') {
      return type;
    }
    if (type.includes('int')) {
      return 'integer';
    }
    if (type === 'fixed' || type === 'ufixed') {
      return 'number';
    }
    return 'any';
  };

  const labels = {
    string: 'Enter text here',
    number: 'Numbers only',
    integer: 'Whole numbers only',
    address: '0x',
    urlNoHttp: 'www.example.fake',
  };

  return inputs.map((input, index) => {
    const localType = getType(input.type);
    const isMulti = input.type.includes('[]');
    return {
      type: isMulti ? 'multiInput' : 'input',
      label: input.name,
      name: `${input.name}*ABI_ARG*${index}`,
      htmlFor: `${input.name}*ABI_ARG*${index}`,
      placeholder: labels[localType] || input.type,
      expectType: isMulti ? 'any' : getType(localType),
      required: false,
    };
  });
};
