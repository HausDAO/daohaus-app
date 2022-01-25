import React, { useEffect, useState, useMemo, useRef } from 'react';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { useParams } from 'react-router';
import { Flex, Button, Spinner } from '@chakra-ui/react';
import { ethers } from 'ethers';

import FieldWrapper from './fieldWrapper';
import ErrorList from './ErrorList';
import { getLocalABI } from '../utils/abi';
import { encodeMulti, collapseToCallData } from '../utils/txHelpers';
import { chainByID } from '../utils/chain';
import { fetchAmbModule } from '../utils/gnosis';
import { CONTRACTS } from '../data/contractTX';

const AmbEncoder = props => {
  const { localForm, error } = props;
  const { register, setValue, watch } = localForm;
  const { daochain } = useParams();
  const [loading, setLoading] = useState();
  const [apiError, setApiError] = useState();
  const [needOrder, setNeedOrder] = useState();

  const multiTx = watch('TX');
  const foreignChainId = watch('foreignChainId');
  const safeAddress = watch('selectedSafeAddress');
  const foreignSafeAddress = watch('foreignSafeAddress');
  const ambTx = watch('ambTx');

  const prevMultiTx = (value => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  })(multiTx);

  useEffect(() => {
    register('ambTx');
  }, []);

  useEffect(() => {
    const txChanged = JSON.stringify(multiTx) !== JSON.stringify(prevMultiTx);
    if (txChanged) {
      setNeedOrder(true);
      setValue('ambTx', false);
    } else if (!prevMultiTx) {
      setNeedOrder(true);
    }
  }, [daochain, foreignChainId, safeAddress, foreignSafeAddress, multiTx]);

  const canSetup = useMemo(
    () =>
      daochain &&
      foreignChainId &&
      safeAddress &&
      foreignSafeAddress &&
      multiTx,
    [daochain, foreignChainId, safeAddress, foreignSafeAddress, multiTx],
  );

  const encodeAmbTx = async () => {
    setLoading(true);
    try {
      const ambModuleAddress = await fetchAmbModule(
        {
          chainId: daochain,
          address: safeAddress,
        },
        foreignChainId,
        foreignSafeAddress,
      );

      const ambModule = new ethers.Contract(
        ambModuleAddress,
        getLocalABI(CONTRACTS.AMB_MODULE),
      );
      const moduleTx = await ambModule.populateTransaction.executeTransaction(
        chainByID(foreignChainId).safeMinion.safe_mutisend_addr,
        '0',
        encodeMulti(collapseToCallData({ TX: multiTx })),
        '1',
      );
      setValue('ambTx', moduleTx);
      setNeedOrder(false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setApiError(err);
      setLoading(false);
    }
  };

  return (
    <FieldWrapper>
      <Flex alignItems='flex-end' mb={3}>
        <Button
          variant='outline'
          size='xs'
          onClick={encodeAmbTx}
          disabled={!canSetup || loading || !needOrder}
          mt={3}
          mr={3}
        >
          Encode Cross-chain Transaction
        </Button>
        {ambTx && !needOrder && (
          <RiCheckboxCircleLine
            style={{
              width: '25px',
              height: '25px',
            }}
            mb={3}
          />
        )}
        {loading && <Spinner />}
      </Flex>
      {apiError && (
        <ErrorList
          singleError={{ message: 'API Error: Please check the logs' }}
        />
      )}
      {error && <ErrorList singleError={error} />}
    </FieldWrapper>
  );
};

export default AmbEncoder;
