import React, { useEffect, useState } from 'react';
import { Button, Flex, Icon } from '@chakra-ui/react';
import { BiMinus, BiPlus } from 'react-icons/bi';

import TextBox from '../components/TextBox';
import FormSection from './formSection';

import { IsJsonString } from '../utils/general';

const TxFormSection = props => {
  const {
    handleAddTx,
    handleRemoveTx,
    txIndex,
    txForms,
    form,
    isLastItem,
    parentForm,
    setParentFields,
  } = props;
  const abiSnippet = parentForm.watch(`TX.${txIndex}.abiInput`);
  const [isVisible, setIsVisible] = useState(true);
  const [fnName, setFnName] = useState('');

  useEffect(() => {
    if (abiSnippet && IsJsonString(abiSnippet)) {
      setFnName(JSON.parse(abiSnippet)?.name);
    } else {
      setFnName('');
    }
  }, [abiSnippet]);

  const toggleVisible = () => setIsVisible(prevState => !prevState);
  const handleClickAdd = () => {
    setIsVisible(false);
    handleAddTx(form);
  };
  const handleClickRemove = () => handleRemoveTx(txIndex);
  const isLastTx = txIndex === txForms?.length - 1;

  return (
    <FormSection
      title={`Transaction ${txIndex + 1} ${fnName && ` (${fnName})`}`}
      isLastItem={isLastItem}
      toggleVisible={toggleVisible}
      isVisible={isVisible}
      form={form}
      txIndex={txIndex}
      parentForm={parentForm}
      setParentFields={setParentFields}
      after={
        <Flex justifyContent='flex-end'>
          {isLastTx ? (
            <Button variant='ghost' onClick={handleClickAdd}>
              <TextBox>Add TX</TextBox>
              <Icon ml={2} as={BiPlus} w='20px' h='20px' cursor='pointer' />
            </Button>
          ) : (
            <Button variant='ghost' onClick={handleClickRemove}>
              <TextBox>Remove TX</TextBox>
              <Icon ml={2} as={BiMinus} w='20px' h='20px' cursor='pointer' />
            </Button>
          )}
        </Flex>
      }
    />
  );
};

export default TxFormSection;
