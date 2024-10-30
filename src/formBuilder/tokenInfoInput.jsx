import React, { useState } from 'react';
import InputSelect from './inputSelect';
import GenericInput from './genericInput';
import { validate } from '../utils/validation';

const tokenInfoInput = props => {
  const { localForm } = props;
  const { watch, setValue } = localForm;
  const [validInput, setValidInput] = useState(null);
  const tokenTypes = [
    // { name: 'ERC20', value: 0 },
    { name: 'ERC721', value: 1 },
    { name: 'ERC1155', value: 2 },
  ];

  const selectedTokenType = watch('tokenType');
  const tokenId = watch('tokenId');

  const resetNumTokens = () => {
    setValue('numTokens', 0);
  };

  const validateInput = async event => {
    setValidInput(validate.number(event.target.value));
  };

  return (
    <>
      <InputSelect
        {...props}
        label='Token ID'
        htmlFor='tokenId'
        name='tokenId'
        selectName='tokenType'
        selectPlaceholder='ERC...'
        options={tokenTypes}
        handleSelectChange={resetNumTokens}
        onChange={validateInput}
        errors={
          tokenId && validInput === false
            ? {
                tokenId: { message: 'Invalid Token ID' },
              }
            : !tokenId && props.errors
        }
      />
      {selectedTokenType === '2' && (
        <GenericInput
          {...props}
          required={false}
          label='Quantity'
          htmlfor='numTokens'
          placeholder='0'
          name='numTokens'
        />
      )}
    </>
  );
};

export default tokenInfoInput;
