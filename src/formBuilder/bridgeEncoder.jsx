import React, { useEffect, useState, useMemo, useRef } from 'react';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import { encodeMulti } from 'ethers-multisend';
import { Flex, Button, Spinner } from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';
import ErrorList from './ErrorList';
import { collapseToCallData } from '../utils/txHelpers';
import {
  encodeBridgeTxProposal,
  fetchCrossChainZodiacModule,
} from '../utils/gnosis';

const BridgeEncoder = props => {
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
  const bridgeModule = watch('bridgeModule');
  const bridgeTx = watch('bridgeTx');

  const prevMultiTx = (value => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  })(multiTx);

  useEffect(() => {
    register('bridgeTx');
  }, []);

  useEffect(() => {
    const txChanged = JSON.stringify(multiTx) !== JSON.stringify(prevMultiTx);
    if (txChanged) {
      setNeedOrder(true);
      setValue('bridgeTx', false);
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

  const encodeBridgeTx = async () => {
    setLoading(true);
    try {
      const bridgeModuleAddress = await fetchCrossChainZodiacModule({
        chainID: foreignChainId,
        crossChainController: {
          address: safeAddress,
          bridgeModule: bridgeModule,
          chainId: daochain,
        },
        safeAddress: foreignSafeAddress,
      });
      const encodedTx = await encodeBridgeTxProposal({
        bridgeModule,
        bridgeModuleAddress,
        daochain,
        encodedTx: encodeMulti(collapseToCallData({ TX: multiTx })),
        foreignChainId,
      });
      setValue('bridgeTx', encodedTx);
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
          onClick={encodeBridgeTx}
          disabled={!canSetup || loading || !needOrder}
          mt={3}
          mr={3}
        >
          Encode Cross-chain Transaction
        </Button>
        {bridgeTx && !needOrder && (
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

export default BridgeEncoder;
