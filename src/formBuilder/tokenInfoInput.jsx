import React from 'react';
import InputSelect from './inputSelect';
import GenericInput from './genericInput';

const tokenInfoInput = props => {
  const { localForm } = props;
  const { watch, setValue } = localForm;
  const tokenTypes = [
    // { name: 'ERC20', value: 0 },
    { name: 'ERC721', value: 1 },
    { name: 'ERC1155', value: 2 },
  ];

  const selectedTokenType = watch('tokenType');

  const resetNumTokens = () => {
    setValue('numTokens', 0);
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
