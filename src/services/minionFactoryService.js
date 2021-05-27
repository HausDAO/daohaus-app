import Web3 from 'web3';

import MinionFactoryAbi from '../contracts/minionFactory.json';
import MinionNiftyFactoryAbi from '../contracts/minionNiftyFactory.json';
import { chainByID } from '../utils/chain';

export const MinionFactoryService = ({ web3, chainID, minionType }) => {
  console.log('chainId', chainID);
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  // TODO: should this just be it's own service?
  let abi;
  let factoryAddr;
  if (minionType === 'niftyMinion') {
    abi = MinionNiftyFactoryAbi;
    factoryAddr = chainByID(chainID).niftyMinion.minion_factory_addr;
  } else {
    abi = MinionFactoryAbi;
    factoryAddr = chainByID(chainID).minion_factory_addr;
  }

  const contract = new web3.eth.Contract(abi, factoryAddr);
  return service => {
    if (service === 'summonMinion') {
      return async ({ args, from, poll, onTxHash }) => {
        console.log('args order matter', {
          args,
          from,
          poll,
          onTxHash,
        });

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
