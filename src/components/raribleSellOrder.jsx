import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { createOrder, getOrderDataFromProposal } from '../utils/rarible';

const RaribleSellOrder = ({ proposal }) => {
  const { daochain } = useParams();
  const [needSellOrder, setNeedSellOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: fetch the order based on prop details to see if it exists, if so link to it on rarible
    setNeedSellOrder(true);
  }, []);

  const makeSellOrder = async () => {
    setLoading(true);

    const orderData = await getOrderDataFromProposal(proposal);

    console.log('orderData', orderData);

    // const res = await createOrder(orderData, daochain);
    // console.log('res', res);

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
