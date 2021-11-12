import { v4 as uuid } from 'uuid';
import { filterObject, isObjectEmpty, pipe } from './general';
import { logFormError } from './errorLog';
import { collectTypeValidations, validate } from './validation';
import { handleSearch } from './txHelpers';

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
    return {
      ...collapseToObjOfArrays(groupedItems, flag),
      ...nonGrouped,
    };
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

  const mapIn = field =>
    Array.isArray(field)
      ? field.map(mapIn)
      : required.includes(field.name)
      ? { ...field, required: true }
      : field;
  const res = fields.map(mapIn);

  return res;
};

export const inputDataFromABI = (inputs, serialTag) => {
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
    if (type === 'bool') {
      return 'boolean';
    }

    return 'any';
  };

  const labels = {
    string: 'Enter text here',
    number: 'Numbers only',
    integer: 'uInt 256',
    address: '0x',
    urlNoHttp: 'www.example.fake',
    boolean: 'True/False',
    bytes32: 'bytes32',
  };

  const assembleMulti = (input, fieldName) => {
    return {
      type: 'listBox',
      label: input.name,
      name: fieldName,
      htmlFor: fieldName,
      placeholder: input.type,
      expectType: 'any',
      registerOptions: {
        required: `${input.name} is a required contract argument`,
      },
    };
  };

  const assembleBool = (input, fieldName) => {
    return {
      type: 'boolSelect',
      label: input.name,
      name: fieldName,
      htmlFor: fieldName,
      placeholder: labels.boolean,
      expectType: 'boolean',
      registerOptions: {
        required: `${input.name} is a required contract argument`,
      },
    };
  };

  return inputs.map((input, index) => {
    const localType = getType(input.type);
    const isMulti = input.type.includes('[]');

    const fieldName = serialTag
      ? `${serialTag}.abiArgs.${index}`
      : `abiArgs.${index}`;

    if (isMulti) {
      return assembleMulti(input, fieldName);
    }
    if (input.type === 'bool') {
      return assembleBool(input, fieldName);
    }
    return {
      type: isMulti ? 'listBox' : 'input',
      label: input.name,
      name: fieldName,
      htmlFor: fieldName,
      placeholder: isMulti ? input.type : labels[localType],
      expectType: isMulti ? 'any' : getType(localType),
      registerOptions: {
        required: `${
          serialTag ? input.name : fieldName
        } is a required contract argument`,
      },
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

export const useFormCondition = ({ value, condition }) => {
  if (typeof value === 'string') return value;
  if (value?.type === 'formCondition' && condition && value?.[condition])
    return value[condition];
};

export const useFormConditions = ({ values = [], condition }) =>
  values.map(val => useFormCondition({ value: val, condition }));

export const checkConditionalTx = ({ tx, condition }) => {
  if (tx?.type === 'formCondition' && tx[condition]) {
    return tx[condition];
  }
  return tx;
};

export const ignoreAwaitStep = next => {
  return typeof next === 'string' ? next : next?.then;
};

const getOriginalName = name => {
  return name
    .split('.')
    .slice(2)
    .join('.');
};

export const getTxIndex = key => key.split('.')[1];

export const decrementTxIndex = key => {
  const segments = key.split('.');
  const currentIndex = segments[1];
  const rest = segments.slice(2).join('.');
  if (validate.number(currentIndex)) {
    return `TX.${Number(currentIndex) - 1}.${rest}`;
  }
  console.error('Did not recieve corrrect TX.[number] value');
  return key;
};

const serializeRequired = (required = [], index) =>
  required?.map(fieldName =>
    fieldName.includes('TX.')
      ? `TX.${index}.${getOriginalName(fieldName)}`
      : `TX.${index}.${fieldName}`,
  );

const serializeFields = (fields = [], txIndex) =>
  fields.map(column =>
    column.map(field => {
      const alreadyHasSerial = field.name.includes('TX.');
      if (alreadyHasSerial) {
        const originalName = getOriginalName(field.name);
        return {
          ...field,
          name: `TX.${txIndex}.${originalName}`,
          htmlFor: `TX.${txIndex}.${originalName}`,
          listenTo: field.listenTo
            ? `TX.${txIndex}.${getOriginalName(field.listenTo)}`
            : null,
        };
      }
      return {
        ...field,
        name: `TX.${txIndex}.${field.name}`,
        htmlFor: `TX.${txIndex}.${field.name}`,
        listenTo: field.listenTo ? `TX.${txIndex}.${field.listenTo}` : null,
      };
    }),
  );

export const serializeTXs = (forms = []) =>
  forms.map((form, index) => ({
    ...form,
    fields: serializeFields(form.fields, index),
    required: serializeRequired(form.required, index),
    txIndex: index,
    txID: form.txID || uuid(),
  }));

const addTypeValidation = (regOptions, valStr) => ({
  ...regOptions,
  validate: { [`type-${valStr}`]: collectTypeValidations(valStr) },
});

const handleRequired = ({ name, label }, required) => regOptions =>
  required.includes(name)
    ? { ...regOptions, required: `${label} is required` }
    : regOptions;

const handleType = ({ expectType }) => regOptions =>
  !expectType || expectType === 'any'
    ? regOptions
    : addTypeValidation(regOptions, expectType);

const handleMinLength = ({ minLength }) => regOptions =>
  minLength ? { ...regOptions, minLength } : regOptions;

const handleMaxLength = ({ maxLength }) => regOptions =>
  maxLength ? { ...regOptions, maxLength } : regOptions;

const overwriteSetValueAs = setValueAs => regOptions =>
  setValueAs ? { ...regOptions, setValueAs } : regOptions;

const spreadValidation = newValidation => regOptions =>
  newValidation
    ? {
        ...regOptions,
        validate: { ...(regOptions?.validate || {}), ...newValidation },
      }
    : regOptions;

export const createRegisterOptions = (field, required = []) =>
  pipe([
    handleRequired(field, required),
    handleType(field),
    handleMinLength(field),
    handleMaxLength(field),
  ])(field.registerOptions || {});

export const spreadOptions = ({ registerOptions, validate, setValueAs }) =>
  pipe([overwriteSetValueAs(setValueAs), spreadValidation(validate)])(
    registerOptions,
  );

const isNestedValue = name => name.includes('.');
const checkNestedError = (errors, name) =>
  handleSearch(errors, `.${name}`, false);

export const handleCheckError = (errors, name) => {
  if (!name || !errors) return;
  return isNestedValue(name) ? checkNestedError(errors, name) : errors[name];
};
