import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex, Icon, Link, Spinner } from '@chakra-ui/react';

import { RiExternalLinkLine } from 'react-icons/ri';
import { useOverlay } from '../contexts/OverlayContext';
import {
  buildRaribleUrl,
  compareOrder,
  createOrder,
  getOrderByItem,
  getOrderDataFromProposal,
} from '../utils/rarible';

const RaribleOrder = ({ proposal, buttonSize = 'md' }) => {
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
        {buttonSize !== 'sm' && <Box>Executed</Box>}
        <Link href={orderUrl} isExternal fontSize={buttonSize}>
          View order on Rarible
          <Icon as={RiExternalLinkLine} name='rarible order' ml={1} mt='-3px' />
        </Link>
      </Flex>
    );
  }

  return (
    <Button disabled={loading} onClick={makeOrder} size={buttonSize}>
      Create Order
    </Button>
  );
};
export default RaribleOrder;
