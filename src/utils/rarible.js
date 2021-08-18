import deepEqual from 'deep-equal';
import { TypedDataUtils } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import Web3 from 'web3';
import { supportedChains } from './chain';

import { ipfsPrePost, ipfsJsonPin, getNftMeta } from './metadata';
import { raribleHashMaker } from './proposalUtils';

export const buildEncodeOrder = args => {
  const salt = Math.floor(Math.random() * 1000);
  return {
    type: 'RARIBLE_V2',
    maker: args.minionAddress,
    make: {
      assetType: {
        assetClass: 'ERC721',
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
    data: {
      dataType: 'RARIBLE_V2_DATA_V1',
      payouts: [],
      originFees: [],
    },
    salt,
    start: args.startDate,
    end: args.endDate,
  };
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
    return response.json();
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
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getOrderByItem = async (contract, tokenId, maker, daochain) => {
  const url = `${supportedChains[daochain].rarible.api_url}/order/orders/sell/byItem`;
  const params = `?contract=${contract}&tokenId=${tokenId}&maker=${maker}`;
  try {
    const response = await fetch(`${url}${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
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
    types: Object.assign({
      EIP712Domain: DOMAIN_TYPE,
    }, encodedOrder.signMessage.types),
    domain: encodedOrder.signMessage.domain,
    primaryType: encodedOrder.signMessage.structType,
    message: encodedOrder.signMessage.struct,
  };
  return bufferToHex(TypedDataUtils.sign(typeData));
};

export const arbitrarySignature =
  '0xc531a1d9046945d3732c73d049da2810470c3b0663788dca9e9f329a35c8a0d56add77ed5ea610b36140641860d13849abab295ca46c350f50731843c6517eee1c';

export const getSignatureHash = () => {
  const arbitrarySignatureHash = Web3.utils.soliditySha3({
    t: 'bytes',
    v: arbitrarySignature,
  });

  return arbitrarySignatureHash;
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

export const getOrderDataFromProposal = async (proposal) => {
  const hash = raribleHashMaker(proposal);
  console.log('hash', hash)
  if (hash !== '') {
    const ipfsData = await getNftMeta(`https://daohaus.mypinata.cloud/ipfs/${hash}`)
    return ipfsData;
  } else {
    return null
  }
}

export const compareSellOrder = (ipfsData, orderRes) => {
  return orderRes.some(order => {
    const propOrderData = {
      ...ipfsData.make,
      ...ipfsData.take,
      start: +ipfsData.start,
      end: +ipfsData.end
    }
  
    const raribleOrderData = {
      ...order.make,
      ...order.take,
      start: order.start,
      end: order.end
    }
    return deepEqual(propOrderData, raribleOrderData)
  })
}