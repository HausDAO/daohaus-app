import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/spinner';

import GenericSelect from './genericSelect';
import GenericTextarea from './genericTextArea';
import ModButton from './modButton';
import { validate } from '../utils/validation';
import {
  fetchABI,
  getABIfunctions,
  formatFNsAsSelectOptions,
} from '../utils/abi';
import { getTxFromName } from '../utils/txHelpers';

const AbiInput = props => {
  const { localForm, listenTo, name, buildABIOptions, hideHex } = props;
  const { daochain } = useParams();
  const [isRawHex, setRawHex] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);

  const targetContract = localForm.watch(listenTo || 'targetContract');
  const abiInput = localForm.watch(name);
  const targetChain = localForm.watch('foreignChainId');
  const helperText = isDisabled && 'Please enter a target contract';

  const abiRef = useRef(null);
  const contractRef = useRef(null);
  useEffect(() => {
    const getABI = async () => {
      try {
        setLoading(true);
        setIsDisabled(false);
        const abi = await fetchABI(targetContract, targetChain ?? daochain);
        const fns = formatFNsAsSelectOptions(getABIfunctions(abi));
        setOptions(fns);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if (targetContract && validate.address(targetContract)) {
      if (targetContract === contractRef.current) return;
      getABI();
      contractRef.current = targetContract;
    }
  }, [targetContract, targetChain, daochain]);

  useEffect(() => {
    if (abiInput) {
      if (abiInput === abiRef.current) return;
      const tag = getTxFromName(name);
      buildABIOptions(abiInput, tag);
      abiRef.current = abiInput;
    }
  }, [abiInput]);

  const switchElement = () => {
    if (hideHex) return;
    if (isRawHex) {
      setRawHex(false);
      buildABIOptions('clear');
    } else {
      setRawHex(true);
      buildABIOptions('hex');
    }
  };

  return (
    <>
      {isRawHex ? (
        <GenericTextarea
          {...props}
          disabled={isDisabled}
          helperText={helperText}
          btn={<ModButton text='Address' fn={switchElement} />}
          h={40}
        />
      ) : (
        <GenericSelect
          {...props}
          placeholder='Select function'
          options={options}
          disabled={isDisabled}
          helperText={helperText}
          btn={
            hideHex || (
              <ModButton
                text={loading ? <Spinner size='sm' /> : 'Raw Hex'}
                fn={switchElement}
              />
            )
          }
        />
      )}
    </>
  );
};

export default AbiInput;
