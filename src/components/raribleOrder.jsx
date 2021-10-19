import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Button, Flex, Link, Spinner } from '@chakra-ui/react';

import {
  buildRaribleUrl,
  compareOrder,
  createOrder,
  getOrderByItem,
  getOrderDataFromProposal,
} from '../utils/rarible';

const RaribleOrder = ({ proposal, orderType }) => {
  const { daochain } = useParams();
  const [needOrder, setNeedOrder] = useState(false);
  const [orderUrl, setOrderUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      setLoading(true);
      const orderData = await getOrderDataFromProposal(proposal);
      const orderRes = await getOrderByItem(
        orderData.make.assetType.tokenId
          ? orderData.make.assetType.contract
          : orderData.take.assetType.contract,
        orderData.make.assetType.tokenId || orderData.take.assetType.tokenId,
        orderData.maker,
        orderData.make.assetType.tokenId ? 'sell' : 'bids',
        daochain,
      );
      setOrderUrl(buildRaribleUrl(orderData, daochain));
      setNeedOrder(!compareOrder(orderData, orderRes.orders));
      setLoading(false);
    };

    getOrder();
  }, []);

  const makeOrder = async () => {
    setLoading(true);

    const orderData = await getOrderDataFromProposal(proposal);
    await createOrder(orderData, daochain);

    setNeedOrder(false);
    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!needOrder) {
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
    <Button disabled={loading} onClick={makeOrder}>
      {`Create ${orderType} Order`}
    </Button>
  );
};
export default RaribleOrder;
