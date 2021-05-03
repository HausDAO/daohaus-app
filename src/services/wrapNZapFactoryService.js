import Web3 from 'web3';

import WrapNZapFactoryAbi from '../contracts/wrapNZapFactory.json';
import { chainByID } from '../utils/chain';

export const WrapNZapFactoryService = ({ web3, chainID, factoryAddress }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  const contract = new web3.eth.Contract(WrapNZapFactoryAbi, factoryAddress);
  return service => {
    if (service === 'create') {
      return async ({ args, address, poll }) => {
        const tx = await contract.methods[service](...args);
        return tx
          .send('eth_requestAccounts', { from: address })
          .on('transactionHash', txHash => {
            if (poll) {
              poll(txHash);
            }
          })
          .on('error', error => {
            console.error(error);
          });
      };
    }
  };
};
