import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex, Link, Spinner } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import {
  buildRaribleUrl,
  compareOrder,
  createOrder,
  getOrderByItem,
  getOrderDataFromProposal,
} from '../utils/rarible';

const RaribleOrder = ({ proposal, orderType }) => {
  const { daochain } = useParams();
  const { errorToast } = useOverlay();
  const [needOrder, setNeedOrder] = useState(false);
  const [orderUrl, setOrderUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      setLoading(true);
      const orderData = await getOrderDataFromProposal(proposal);
      if (orderData.make.assetType.tokenId) {
        const orderRes = await getOrderByItem(
          orderData.make.assetType.contract,
          orderData.make.assetType.tokenId,
          orderData.maker,
          'sell',
          daochain,
        );
        setNeedOrder(!compareOrder(orderData, orderRes.orders));
      } else {
        const orders = (
          await Promise.all(
            ['ACTIVE', 'FILLED', 'INACTIVE', 'CANCELLED'].map(
              async status =>
                (
                  await getOrderByItem(
                    orderData.take.assetType.contract,
                    orderData.take.assetType.tokenId,
                    orderData.maker,
                    'bids',
                    daochain,
                    status,
                  )
                ).orders,
            ),
          )
        ).reduce((a, b) => [...a, ...b], []);
        setNeedOrder(!compareOrder(orderData, orders));
      }
      setOrderUrl(buildRaribleUrl(orderData, daochain));
      setLoading(false);
    };

    getOrder();
  }, []);

  const makeOrder = async () => {
    setLoading(true);

    try {
      const orderData = await getOrderDataFromProposal(proposal);
      await createOrder(orderData, daochain);
      setNeedOrder(false);
    } catch (error) {
      errorToast({
        title: 'Order Submission Error',
        description: error.message,
      });
    }
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
