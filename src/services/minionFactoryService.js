import Web3 from 'web3';

import MinionFactoryAbi from '../contracts/minionFactory.json';
import { chainByID } from '../utils/chain';

export const MinionFactoryService = ({ web3, chainID }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = MinionFactoryAbi;
  const contract = new web3.eth.Contract(
    abi,
    chainByID(chainID).minion_factory_addr,
  );
  return service => {
    if (service === 'summonMinion') {
      return async ({ args, from, poll, onTxHash }) => {
        console.log({
          args,
          from,
          poll,
          onTxHash,
        });
        console.log(contract);
        try {
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
    return null;
  };
};
