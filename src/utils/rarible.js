import deepEqual from 'deep-equal';
import { TypedDataUtils } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { supportedChains } from './chain';

import { ipfsPrePost, ipfsJsonPin, getNftMeta } from './metadata';
import { raribleHashMaker } from './proposalUtils';
import { getRaribleApi } from './requests';

const buildEncodeOrder = ({ maker, make, take, start, end }) => {
  const salt = Math.floor(Math.random() * 1000);
  return {
    type: 'RARIBLE_V2',
    maker,
    make,
    take,
    data: {
      dataType: 'RARIBLE_V2_DATA_V1',
      payouts: [],
      originFees: [],
    },
    salt,
    start,
    end,
    signature: '',
  };
};

export const buildSellOrder = args => {
  return buildEncodeOrder({
    maker: args.makerAddress,
    make: {
      assetType: {
        assetClass: args.nftType,
        contract: args.nftContract,
        tokenId: args.tokenId,
      },
      value: '1',
    },
    take: {
      assetType: {
        assetClass: 'ERC20',
        contract: args.tokenAddress,
      },
      value: args.price,
    },
    start: args.startDate ? args.startDate : null,
    end: args.endDate ? args.endDate : null,
  });
};

export const buildBuyOrder = args => {
  return buildEncodeOrder({
    maker: args.makerAddress,
    make: {
      assetType: {
        assetClass: 'ERC20',
        contract: args.tokenAddress,
      },
      value: args.price,
    },
    take: {
      assetType: {
        assetClass: args.nftType,
        contract: args.nftContract,
        tokenId: args.tokenId,
      },
      value: '1',
    },
  });
};

export const encodeOrder = async (order, daochain) => {
  const url = `${supportedChains[daochain].rarible.api_url}/order/encoder/order`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    const data = await response.json();
    if (data.status && data.code) {
      throw new Error(
        `An error occurred while trying to encode Rarible order: (${data.code}): ${data.message}`,
      );
    }
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export const createOrder = async (order, daochain) => {
  const url = `${supportedChains[daochain].rarible.api_url}/order/orders`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    const data = await response.json();
    if (data.status && data.code) {
      throw new Error(
        `An error occurred while trying to submit an order to Rarible: (${data.code}): ${data.message}`,
      );
    }
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getOrderByItem = async (
  contract,
  tokenId,
  maker,
  orderType,
  daochain,
  status = 'ACTIVE',
) => {
  const endpoint = `order/orders/${orderType}/byItemAndByStatus?contract=${contract}&tokenId=${tokenId}&maker=${maker}${
    orderType === 'bids' ? `&status=${status}` : ''
  }`;
  return getRaribleApi(daochain, endpoint);
};

const DOMAIN_TYPE = [
  {
    type: 'string',
    name: 'name',
  },
  {
    type: 'string',
    name: 'version',
  },
  {
    type: 'uint256',
    name: 'chainId',
  },
  {
    type: 'address',
    name: 'verifyingContract',
  },
];

export const getMessageHash = encodedOrder => {
  const typeData = {
    /* eslint-disable */
    types: Object.assign(
      {
        EIP712Domain: DOMAIN_TYPE,
      },
      encodedOrder.signMessage.types,
    ),
    domain: encodedOrder.signMessage.domain,
    primaryType: encodedOrder.signMessage.structType,
    message: encodedOrder.signMessage.struct,
  };
  return bufferToHex(TypedDataUtils.sign(typeData));
};

export const pinOrderToIpfs = async (order, daoid) => {
  const keyRes = await ipfsPrePost('dao/ipfs-key', {
    daoAddress: daoid,
  });

  console.log('keyRes', keyRes);
  const ipfsRes = await ipfsJsonPin(keyRes, order);

  console.log('ipfsRes', ipfsRes);

  return ipfsRes;
};

export const getOrderDataFromProposal = async proposal => {
  const hash = raribleHashMaker(proposal);
  console.log('hash', hash);
  if (hash !== '') {
    const ipfsData = await getNftMeta(
      `https://daohaus.mypinata.cloud/ipfs/${hash}`,
    );
    return ipfsData;
  } else {
    return null;
  }
};

export const compareOrder = (ipfsData, orderRes) => {
  return orderRes.some(order => {
    const propOrderData = {
      make: ipfsData.make,
      take: ipfsData.take,
      start: ipfsData.start && Number(ipfsData.start),
      end: ipfsData.end && Number(ipfsData.end),
    };

    const raribleOrderData = {
      make: {
        assetType: {
          assetClass: order.make.assetType.assetClass.match(/ERC\d+/)[0],
          contract: order.make.assetType.contract,
        },
        value: order.make.value,
      },
      take: {
        assetType: {
          assetClass: order.take.assetType.assetClass.match(/ERC\d+/)[0],
          contract: order.take.assetType.contract,
        },
        value: order.take.value,
      },
      start: order.start,
      end: order.end,
    };
    if (order.make.assetType.tokenId) {
      raribleOrderData.make.assetType.tokenId = order.make.assetType.tokenId;
    }
    if (order.take.assetType.tokenId) {
      raribleOrderData.take.assetType.tokenId = order.take.assetType.tokenId;
    }
    return deepEqual(propOrderData, raribleOrderData);
  });
};

export const buildRaribleUrl = (orderData, daochain) => {
  const tokenId =
    orderData.make.assetType.tokenId || orderData.take.assetType.tokenId;
  const contract = orderData.make.assetType.tokenId
    ? orderData.make.assetType.contract
    : orderData.take.assetType.contract;
  return `${supportedChains[daochain].rarible.base_url}/token/${contract}:${tokenId}`;
};

export const fetchNftMeta = async (daochain, itemId) => {
  return getRaribleApi(daochain, `nft/items/${itemId}/meta`);
};

export const fetchLazyNftMeta = async (daochain, itemId) => {
  try {
    const lazyMeta = await getRaribleApi(daochain, `nft/items/${itemId}/lazy`);
    return lazyMeta;
  } catch (error) {
    console.error(error);
  }
};
