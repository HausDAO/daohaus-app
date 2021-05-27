import { Spinner } from '@chakra-ui/spinner';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { validate } from '../utils/validation';
import GenericSelect from './genericSelect';
import GenericTextarea from './genericTextArea';
import { ModButton } from './staticElements';
import { fetchABI } from '../utils/abi';

const AbiInput = props => {
  const { localForm } = props;
  const { daochain } = useParams();
  const [isRawHex, setRawHex] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [functions, setFunctions] = useState(null);

  const targetContract = localForm.watch('targetContract');

  const helperText = isDisabled && 'Please enter a target contract';

  useEffect(() => {
    const getABI = async () => {
      try {
        const abi = await fetchABI(targetContract, daochain);
        setIsDisabled(false);
        console.log(abi);
      } catch (error) {
        console.error(error);
      }
    };
    if (targetContract && validate.publicKey(targetContract)) {
      setLoading(true);
      getABI();
    } else {
      setIsDisabled(true);
    }
  }, [targetContract]);

  const switchElement = () => {
    setRawHex(prevState => !prevState);
  };

  return (
    <>
      {isRawHex ? (
        <GenericTextarea
          {...props}
          disabled={isDisabled}
          helperText={helperText}
          btn={<ModButton label='Address' callback={switchElement} />}
          h={40}
        />
      ) : (
        <GenericSelect
          {...props}
          placeholder='Select function'
          options={[]}
          disabled={isDisabled}
          helperText={helperText}
          btn={
            <ModButton
              label={loading ? <Spinner size='sm' /> : 'Raw Hex'}
              callback={switchElement}
            />
          }
        />
      )}
    </>
  );
};

export default AbiInput;
