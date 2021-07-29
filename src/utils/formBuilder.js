import { filterObject, isObjectEmpty } from './general';
import { logFormError } from './errorLog';

export const splitMulti = (key, value, flag) => {
  const splitKey = key.split(flag);
  return { key: splitKey[0], value, order: splitKey[1] };
};

export const collapseToObjOfArrays = (multis, flag) => {
  const newObj = {};
  for (const multi in multis) {
    const data = splitMulti(multi, multis[multi], flag);
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
  if (collapseType === 'objOfArrays') {
    return { ...collapseToObjOfArrays(groupedItems), ...nonGrouped };
  }
  const orderedArray = Object.entries(groupedItems)
    .map(([key, value]) => splitMulti(key, value, flag))
    .sort((a, b) => a.order - b.order)
    .map(obj => obj.value);

  if (collapseType === 'singleField') {
    return { [flag]: orderedArray, ...nonGrouped };
  }
  if (collapseType === 'array') {
    return orderedArray;
  }
  throw new Error('did not recieve collapseType');
};

export const mapInRequired = (fields, required) => {
  if (!required?.length || !fields) return fields;
  // go through each sub array to
  // REVIEW
  return fields.map(field => {
    if (Array.isArray(field)) {
      return field.map(f =>
        required.includes(f.name) ? { ...f, required: true } : f,
      );
    }
    return required.includes(field.name) ? { ...field, required: true } : field;
  });
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

export const handleFormError = ({
  contextData,
  formData,
  args,
  values,
  error,
  errorToast,
  loading,
}) => {
  const errMsg = error?.message || '';
  console.error(error);
  loading?.(false);
  logFormError({
    contextData,
    formData,
    args,
    values,
    errMsg,
  });
  errorToast?.({
    title: 'Error Submitting Proposal',
    description: errMsg,
  });
};
