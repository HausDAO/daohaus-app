import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
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
import { getTagRegex } from '../utils/formBuilder';

const AbiInput = props => {
  const { localForm, listenTo, name, tag = 'TX' } = props;
  const { daochain } = useParams();
  const [isRawHex, setRawHex] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);

  const targetContract = localForm.watch(listenTo || 'targetContract');
  const abiInput = localForm.watch(name);
  const helperText = isDisabled && 'Please enter a target contract';

  useEffect(() => {
    const getABI = async () => {
      try {
        setLoading(true);
        setIsDisabled(false);
        const abi = await fetchABI(targetContract, daochain);
        const fns = formatFNsAsSelectOptions(getABIfunctions(abi));
        setOptions(fns);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if (targetContract && validate.address(targetContract)) {
      getABI();
    } else {
      setIsDisabled(true);
    }
  }, [targetContract]);

  useEffect(() => {
    if (abiInput) {
      const serialTag = name?.match(getTagRegex(tag))?.[0];
      console.log(`serialTag`, serialTag);
      props.buildABIOptions(abiInput, serialTag);
    } else if (isRawHex) {
      props.buildABIOptions('hex');
    } else {
      props.buildABIOptions('clear');
    }
  }, [abiInput]);

  const switchElement = () => {
    if (isRawHex) {
      setRawHex(false);
      props.buildABIOptions('clear');
    } else {
      setRawHex(true);
      props.buildABIOptions('hex');
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
            <ModButton
              text={loading ? <Spinner size='sm' /> : 'Raw Hex'}
              fn={switchElement}
            />
          }
        />
      )}
    </>
  );
};

export default AbiInput;
