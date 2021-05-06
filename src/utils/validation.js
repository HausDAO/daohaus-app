// Error Model {
//   message: String (required)
//   status: String
//   details: String
//   name: String (field name)
//

export const validateRequired = (values, required) => {
  //  takes in array of required fields
  if (!values || !required?.length) {
    throw new Error(
      `Did not recieve truthy 'values' and/or 'required' in Function 'checkRequired`,
    );
  }
  const errors = required.reduce((arr, field) => {
    if (!values[field.name]) {
      return [
        ...arr,
        {
          message: `${field.label} is required.`,
          name: field.name,
        },
      ];
    }
    return arr;
  }, []);
  console.log(errors);
  if (!errors.length) {
    return false;
  }
  return errors;
};
