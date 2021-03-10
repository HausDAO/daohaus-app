import Web3 from 'web3';

import UberHausMinionAbi from '../contracts/uberHausMinion.json';
import { chainByID } from '../utils/chain';

export const UberHausMinionService = ({ web3, chainID, uberHausMinion }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const contract = new web3.eth.Contract(UberHausMinionAbi, uberHausMinion);

  return function getService(service) {
    if (service === 'getAction') {
      return async ({ proposalId }) => {
        const action = await contract.methods.actions(proposalId).call();
        return action;
      };
    }
    if (service === 'currentDelegate') {
      return async () => {
        const action = await contract.methods.currentDelegate().call();
        return action;
      };
    }
    if (service === 'proposeAction' || service === 'executeAction') {
      return async ({ args, address, poll, onTxHash }) => {
        console.log(contract);
        try {
          console.log(args, address);
          const tx = await contract.methods[service](...args);
          console.log('tx', tx);
          return tx
            .send('eth_requestAccounts', { from: address })
            .on('transactionHash', (txHash) => {
              if (poll) {
                onTxHash();
                poll(txHash);
              }
            })
            .on('error', (error) => {
              console.error(error);
            });
        } catch (error) {
          console.log('fired in service');
          return error;
        }
      };
    }
  };
};
