import { eip712Hash } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import Web3 from 'web3';

import { ipfsPrePost, ipfsJsonPin } from './metadata';

export const buildEncodeOrder = data => {
  const salt = Math.floor(Math.random() * (1 - 1000));
  return {
    type: 'RARIBLE_V2',
    maker: data.minionAddress,
    make: {
      assetType: {
        assetClass: 'ERC721',
        contract: data.nftContract,
        tokenId: data.tokenId,
      },
      value: '1',
    },
    take: {
      assetType: {
        assetClass: 'ERC20',
        contract: data.tokenAddress,
      },
      value: data.price,
    },
    data: {
      dataType: 'RARIBLE_V2_DATA_V1',
      payouts: [],
      originFees: [],
    },
    salt,
    start: data.start,
    end: data.end,
  };
};

export const encodeOrder = async order => {
  const url =
    'https://api-staging.rarible.com/protocol/v0.1/ethereum/order/encoder/order';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: order,
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getMessageHash = encodedOrder => {
  // what is version?
  const version = '0';
  const hash = eip712Hash(encodedOrder.signMessage, version);
  console.log('hash', hash);
  return bufferToHex(hash);
};

export const getSignatureHash = () => {
  const arbitrarySignature =
    '0xc531a1d9046945d3732c73d049da2810470c3b0663788dca9e9f329a35c8a0d56add77ed5ea610b36140641860d13849abab295ca46c350f50731843c6517eee1c';
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
  const ipfsRes = await ipfsJsonPin(keyRes, order);

  console.log('ipfsRes', ipfsRes);

  return ipfsRes;
};
