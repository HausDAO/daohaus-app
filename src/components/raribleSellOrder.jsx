import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useParams } from 'react-router';
import {
  compareSellOrder,
  createOrder,
  getOrderByItem,
  getOrderDataFromProposal,
} from '../utils/rarible';

const RaribleSellOrder = ({ proposal }) => {
  const { daochain } = useParams();
  const [needSellOrder, setNeedSellOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      const orderData = await getOrderDataFromProposal(proposal);
      const orderRes = await getOrderByItem(
        orderData.make.assetType.contract,
        orderData.make.assetType.tokenId,
        orderData.maker,
        daochain,
      );

      setNeedSellOrder(!compareSellOrder(orderData, orderRes.orders));
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

  if (!needSellOrder) return null;

  return (
    <Button disabled={loading} onClick={makeSellOrder}>
      Create Sell Order
    </Button>
  );
};
export default RaribleSellOrder;
