import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { Spinner } from '@chakra-ui/spinner';
import GenericInput from './genericInput';

import { validate } from '../utils/validation';
import { checkContractType } from '../utils/tokenExplorerApi';

const GatedInput = props => {
  const { daochain } = useParams();
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(false);

  const { localForm, only } = props;
  const { watch } = localForm;
  console.log(only);
  const tokenAddress = watch('tokenAddress');

  useEffect(() => {
    let shouldUpdate = true;

    const checkIsCorrect = async () => {
      //  TODO add ability to disable form
      setLoading(true);
      const isCorrectContractType = await checkContractType(
        tokenAddress,
        daochain,
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

    if (tokenAddress && validate.address(tokenAddress) && only.model) {
      checkIsCorrect();
    } else {
      setLoading(false);
      setIsCorrect(null);
    }
    return () => {
      shouldUpdate = false;
    };
  }, [tokenAddress, only]);

  const getHelperText = () => {
    if (loading) return <Spinner />;
    if (isCorrect) return `Valid ${only.name}`;
    if (isCorrect === false) return `Not a valid ${only.name}`;
    if (isCorrect === null) return '';
  };

  return <GenericInput {...props} helperText={getHelperText()} />;
};

export default GatedInput;
