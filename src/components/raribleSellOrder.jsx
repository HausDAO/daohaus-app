import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Link, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router';

import {
  buildRaribleUrl,
  compareSellOrder,
  createOrder,
  getOrderByItem,
  getOrderDataFromProposal,
} from '../utils/rarible';

const RaribleSellOrder = ({ proposal }) => {
  const { daochain } = useParams();
  const [needSellOrder, setNeedSellOrder] = useState(false);
  const [orderUrl, setOrderUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      setLoading(true);
      const orderData = await getOrderDataFromProposal(proposal);
      const orderRes = await getOrderByItem(
        orderData.make.assetType.contract,
        orderData.make.assetType.tokenId,
        orderData.maker,
        daochain,
      );

      setOrderUrl(buildRaribleUrl(orderData, daochain));
      setNeedSellOrder(!compareSellOrder(orderData, orderRes.orders));
      setLoading(false);
    };

    getOrder();
  }, []);

  const makeSellOrder = async () => {
    setLoading(true);

    const orderData = await getOrderDataFromProposal(proposal);
    const res = await createOrder(orderData, daochain);
    console.log('order res', res);

    setNeedSellOrder(false);
    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!needSellOrder) {
    return (
      <Flex direction='column' alignItems='center'>
        <Box>Executed</Box>
        <Link href={orderUrl} isExternal>
          View order on Rarible
        </Link>
      </Flex>
    );
  }

  return (
    <Button disabled={loading} onClick={makeSellOrder}>
      Create Sell Order
    </Button>
  );
};
export default RaribleSellOrder;
