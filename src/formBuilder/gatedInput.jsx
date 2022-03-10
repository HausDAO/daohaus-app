import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/spinner';

import GenericInput from './genericInput';
import { validate } from '../utils/validation';
import { checkContractType } from '../utils/tokenExplorerApi';

const GatedInput = props => {
  const { localForm, only, name, foreignChain } = props;
  const { daochain } = useParams();
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(false);

  const { watch } = localForm;
  const contractAddress = watch(name);
  const customChainId = foreignChain && watch('foreignChainId');

  useEffect(() => {
    let shouldUpdate = true;

    const checkIsCorrect = async () => {
      const chainId = customChainId || daochain;
      //  TODO add ability to disable form
      setLoading(true);
      const isCorrectContractType = await checkContractType(
        contractAddress,
        chainId,
        only.model,
      );
      if (!shouldUpdate) return;
      if (isCorrectContractType) {
        setIsCorrect(true);
        setLoading(false);
      } else {
        setIsCorrect(false);
        setLoading(false);
      }
    };

    if (contractAddress && validate.address(contractAddress) && only.model) {
      checkIsCorrect();
    } else {
      setLoading(false);
      setIsCorrect(null);
    }
    return () => {
      shouldUpdate = false;
    };
  }, [contractAddress, only]);

  const getHelperText = () => {
    if (loading) return <Spinner size='xs' />;
    if (isCorrect) return `Valid ${only.name}`;
    if (isCorrect === false) return `Not a valid ${only.name}`;
    if (isCorrect === null) return '';
  };

  return <GenericInput {...props} helperText={getHelperText()} />;
};

export default GatedInput;
