import Web3 from 'web3';

import TransmutationFactoryAbi from '../contracts/transmutationFactory.json';
import { chainByID } from '../utils/chain';

export const TransmutationFactoryService = ({ web3, chainID }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = TransmutationFactoryAbi;
  const contract = new web3.eth.Contract(
    abi,
    chainByID(chainID).transmutation_factory_addr,
  );
  return service => {
    if (service === 'summonTransmutation') {
      return async ({ args, from, poll, onTxHash }) => {
        console.log({
          args,
          from,
          poll,
          onTxHash,
        });
        console.log(contract);
        try {
          console.log(args, from);
          const tx = await contract.methods[service](...args);
          return tx
            .send({ from })
            .on('transactionHash', txHash => {
              if (poll) {
                onTxHash(txHash);
                poll(txHash);
              }
            })
            .on('error', error => {
              console.error(error);
            });
        } catch (error) {
          return error;
        }
      };
    }
  };
};
