import React, { useEffect, useState } from 'react';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { useParams } from 'react-router';
import { Flex, Button, Spinner } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import ErrorList from './ErrorList';
import FieldWrapper from './fieldWrapper';
import { addZeros } from '../utils/tokenValue';
import {
  buildBuyOrder,
  buildSellOrder,
  encodeOrder,
  getMessageHash,
  pinOrderToIpfs,
} from '../utils/rarible';

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
  const orderPrice = watch('orderPrice');
  const tokenId = watch('tokenId');
  const nftType = watch('nftType');
  const selectedMinion = watch('selectedMinion');
  const raribleNftData = watch(name);
  const market = watch('market');
  const orderType = watch('orderType');

  const canSetup =
    nftAddress &&
    paymentToken &&
    orderPrice &&
    selectedMinion &&
    market &&
    orderType &&
    !raribleNftData;

  useEffect(() => {
    register('ipfsOrderHash');
    register('eip712HashValue');
    register('signatureHash');
    register(name);
  }, []);

  useEffect(() => {
    setValue(name, false);
  }, [
    nftAddress,
    paymentToken,
    orderPrice,
    selectedMinion,
    startDate,
    endDate,
  ]);

  const setupOrder = async () => {
    setLoading(true);

    const currentMinion = daoOverview.minions.find(
      minion => minion.minionAddress === selectedMinion,
    );
    const guildToken = daoOverview.tokenBalances.find(token => {
      return token.token.tokenAddress === paymentToken;
    });
    const orderObj =
      orderType === 'buy'
        ? buildBuyOrder({
            nftContract: nftAddress,
            nftType,
            tokenId,
            tokenAddress: paymentToken,
            price: addZeros(orderPrice, guildToken.token.decimals),
            makerAddress:
              currentMinion.safeAddress || currentMinion.minionAddress,
          })
        : buildSellOrder({
            nftContract: nftAddress,
            nftType,
            tokenId,
            tokenAddress: paymentToken,
            price: addZeros(orderPrice, guildToken.token.decimals),
            makerAddress:
              currentMinion.safeAddress || currentMinion.minionAddress,
            startDate: !isNaN(startDate) && startDate,
            endDate: !isNaN(endDate) && endDate,
          });
    const encodedOrder = await encodeOrder(orderObj, daochain);
    const eip712 = getMessageHash(encodedOrder);
    orderObj.signature = '0x'; // zero-length signature to be compliant with Gnosis Asafe EIP-1271
    const ipfsHash = await pinOrderToIpfs(orderObj, daoid);

    setValue('eip712HashValue', eip712);
    setValue('ipfsOrderHash', ipfsHash.IpfsHash);
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
          {`Setup ${market || ''} Order Data`}
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
      {error && <ErrorList singleError={error} />}
    </FieldWrapper>
  );
};

export default RaribleNftSelect;
