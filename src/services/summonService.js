import Web3 from 'web3';

import v21FactoryAbi from '../contracts/molochV21Factory.json';
import { chainByID } from '../utils/chain';

export const SummonService = ({
  web3,
  chainID,
  // atBlock = 'latest'
}) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = v21FactoryAbi;
  const contract = new web3.eth.Contract(
    abi,
    chainByID(chainID).moloch_factory_addr,
  );
  return service => {
    if (service === 'summonMoloch') {
      return async ({ args, from, poll, onTxHash }) => {
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
  };
};
