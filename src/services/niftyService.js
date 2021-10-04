import Web3 from 'web3';

import NFTAbi from '../contracts/niftyInk.json';
import { chainByID } from '../utils/chain';

export const NiftyService = ({
  web3,
  chainID,
  tokenAddress,
  // atBlock = 'latest',
}) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = NFTAbi;
  const contract = new web3.eth.Contract(abi, tokenAddress);
  return service => {
    if (service === 'tokenOfOwnerByIndex') {
      return async ({ accountAddr, index }) => {
        try {
          const tokenOfOwnerByIndex = await contract.methods
            .tokenOfOwnerByIndex(accountAddr, index)
            .call();
          return tokenOfOwnerByIndex;
        } catch (error) {
          console.error('ERR:', error);
        }
        return null;
      };
    }
    if (service === 'inkTokenByIndex') {
      console.log('methods', contract.methods);
      return async ({ inkUrl, index }) => {
        try {
          const tokenOfOwnerByIndex = await contract.methods
            .inkTokenByIndex(inkUrl, index)
            .call();
          return tokenOfOwnerByIndex;
        } catch (error) {
          console.error('ERR:', error);
        }
        return null;
      };
    }
    if (service === 'tokenURI') {
      return async ({ tokenId }) => {
        try {
          const tokenURI = await contract.methods.tokenURI(tokenId).call();
          return tokenURI;
        } catch (error) {
          console.error('ERR:', error);
        }
        return null;
      };
    }
    if (service === 'tokenPrice') {
      return async ({ tokenId }) => {
        try {
          const tokenPrice = await contract.methods.tokenPrice(tokenId).call();
          return tokenPrice;
        } catch (error) {
          console.error('ERR:', error);
        }
        return null;
      };
    }
    if (service === 'buyInkNoop') {
      console.log(
        '????????? contract.methods.buyInk',
        contract.methods
          .buyInk('QmS2J1v12ijHBjfkRp5nNAW6RjZdi8uLtfivCjcNFcJWWT')
          .encodeABI(),
      );
      return async ({ inkUrl }) => {
        try {
          console.log('inkUrl', inkUrl);
          const hex = contract.methods.buyInk(inkUrl).encodeABI();
          console.log('hex', hex);
          return hex;
        } catch (error) {
          console.error('!!!!encode ERR:', error);
        }
        return null;
      };
    }
    if (service === 'setTokenPriceNoop') {
      return async ({ tokenId, price }) => {
        try {
          console.log('tokenId, price', tokenId, price);
          const hex = contract.methods
            .setTokenPrice(+tokenId, price)
            .encodeABI();
          console.log('hex', hex);
          return hex;
        } catch (error) {
          console.error('>>>>>>>encode ERR:', error);
        }
        return null;
      };
    }
    if (service === 'safeTransferFromNoop') {
      return async ({ tokenId, destination, from }) => {
        console.log('safeTransferFromNoop w f', tokenId, destination, from);
        try {
          const hex = contract.methods
            .safeTransferFrom(from, destination, +tokenId)
            .encodeABI();
          console.log('hex', hex);
          return hex;
        } catch (error) {
          console.error('>>>>>>>encode ERR:', error);
        }
        return null;
      };
    }

    return null;
  };
};
