import React, { useEffect, useState } from 'react';
import { Flex, Button, Spinner } from '@chakra-ui/react';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { useParams } from 'react-router';
import FieldWrapper from './fieldWrapper';
import {
  arbitrarySignature,
  buildEncodeOrder,
  encodeOrder,
  getMessageHash,
  getSignatureHash,
  pinOrderToIpfs,
} from '../utils/rarible';
import { useDao } from '../contexts/DaoContext';
import { addZeros } from '../utils/tokenValue';
import ErrorList from './ErrorList';

const RaribleNftSelect = props => {
  const { localForm, name, error } = props;
  const { register, setValue, watch } = localForm;
  const { daoOverview } = useDao();
  const { daochain, daoid } = useParams();
  const [loading, setLoading] = useState(false);

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const paymentToken = watch('paymentToken');
  const nftAddress = watch('nftAddress');
  const sellPrice = watch('sellPrice');
  const tokenId = watch('tokenId');
  const selectedMinion = watch('selectedMinion');
  const raribleNftData = watch(name);

  const canSetup =
    nftAddress &&
    paymentToken &&
    sellPrice &&
    selectedMinion &&
    !raribleNftData;

  useEffect(() => {
    register('ipfsOrderHash');
    register('eip712HashValue');
    register('signatureHash');
    register(name);
  }, []);

  useEffect(() => {
    setValue(name, false);
  }, [nftAddress, paymentToken, sellPrice, selectedMinion, startDate, endDate]);

  const setupOrder = async () => {
    setLoading(true);

    const currentMinion = daoOverview.minions.find(
      minion => minion.minionAddress === selectedMinion,
    );
    const guildToken = daoOverview.tokenBalances.find(token => {
      return token.token.tokenAddress === paymentToken;
    });
    const orderObj = buildEncodeOrder({
      nftContract: nftAddress,
      tokenId,
      tokenAddress: paymentToken,
      price: addZeros(sellPrice, guildToken.token.decimals),
      minionAddress: currentMinion.safeAddress || currentMinion.minionAddress,
      startDate: isNaN(startDate) ? '0' : startDate,
      endDate: isNaN(endDate) ? '0' : endDate,
    });
    const encodedOrder = await encodeOrder(orderObj, daochain);
    const eip712 = getMessageHash(encodedOrder);
    orderObj.signature = arbitrarySignature;
    const ipfsHash = await pinOrderToIpfs(orderObj, daoid);

    setValue('eip712HashValue', eip712);
    setValue('ipfsOrderHash', ipfsHash.IpfsHash);
    setValue('signatureHash', getSignatureHash());
    setValue(name, true);

    setLoading(false);
  };

  //  REVIEW
  //  Can this component use the usual FieldWrapper pattern?

  return (
    <FieldWrapper>
      <Flex alignItems='flex-end'>
        <Button
          variant='outline'
          size='xs'
          onClick={setupOrder}
          disabled={!canSetup || loading}
          mt={3}
          mr={3}
        >
          Setup Rarible Order Data
        </Button>
        {raribleNftData && (
          <RiCheckboxCircleLine
            style={{
              width: '25px',
              height: '25px',
            }}
          />
        )}
        {loading && <Spinner />}
      </Flex>
      {error && <ErrorList message={error.message} />}
    </FieldWrapper>
  );
};

export default RaribleNftSelect;
